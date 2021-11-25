import { Command } from 'discord-akairo'
import { Message, GuildMember } from 'discord.js'

import Case, { ICase }  from '../../models/Case'
import ModUtil from '../../util/structures/ModUtil'

export default class Unmute extends Command {
    public constructor() {
        super('unmute', {
            aliases: ['unmute', 'unsilence', 'unshadowrealm'],
            category: 'Moderation',
            description: {
                    content: 'Unmutes a user',
                    usage: 'unmute [@user] <reason>',
                    examples: ['unmute @user false mute']
            },
            channel: 'guild',
            ratelimit: 3,
            args: [
                {
                    id: 'member',
                    type: 'member',
                    prompt: {
                        start: (msg: Message) => `${msg.author}, please select a member to unmute`,
                        retry: (msg: Message) => `${msg.author}, please select a valid member to unmute`,
                        cancel: () => 'The command has now been cancelled.'
                    }
                },
                {
                    id: 'reason',
                    type: 'string',
                    match: 'rest',
                    default: 'No reason specified.'
                }
            ]
        })
    }

    //@ts-ignore
    userPermissions(message: Message) {
        const modRole = this.client.settings.get(message.guild, 'modRole', '')
        const hasStaffRole = message.member.permissions.has('KICK_MEMBERS', true) || message.member.roles.cache.has(modRole)

        if (!hasStaffRole) return 'Moderator'
        return null
    }

    public async exec(message: Message, {member, reason}: {member: GuildMember, reason: string}): Promise<Message> {
        const totalCases: number = this.client.settings.get(message.guild, 'totalCases', 0) + 1
        const muteRole = message.guild.roles.resolve(this.client.settings.get(message.guild, 'muteRole', ''))

        if (!muteRole) return message.channel.send('You need to set a mute role before being able to mute a user.')
        if (!muteRole.editable) return message.channel.send('I am unable to take the mute role to members. Please make sure my role is above this role.')

        if (member.roles.cache.find(r => r === muteRole)) {
            await new Case({
                id: await Case.countDocuments() + 1,
                guildID: message.guild.id,
                messageID: message.id,
                caseID: totalCases,

                action: ModUtil.CONSTANTS.ACTIONS.UNMUTE,
                actionComplete: true,
                reason: reason,                

                targetID: member.user.id,
                targetTag: member.user.tag,
                modID: message.author.id,
                modTag: message.author.tag
            }).save()

            this.client.settings.set(message.guild, 'totalCases', totalCases)

            const errorOnRun = await this.findCancelMute(member)
                .then(async c => { return this.client.muteManager.cancelMute(c)}) // CHECKS FOR THE EXISTING MUTE ON THE USER AND REMOVES IT WITH THE ROLE
                .catch(async () => { member.roles.cache.some(r => r === muteRole) ? await member.roles.remove(muteRole) : void 0 }) //JUST REMOVES THE ROLE OR EXITS IF THEY DON'T HAVE THE ROLE
                
            if (typeof errorOnRun === 'string') return message.channel.send(errorOnRun)

            setTimeout(() => { message.delete() }, 3000)
            return message.channel.send(`${member} has been unmuted. Reason: ${reason}`)
        } else {
            return message.channel.send('This user is not muted or I am unable to remove the role from this user.')
        }
    }

    private async findCancelMute(member: GuildMember): Promise<ICase> {
        try {
            return await Case.find()
                .then(cArr => cArr.find(c => c.targetID === member.user.id && c.action === ModUtil.CONSTANTS.ACTIONS.MUTE && c.actionComplete === false))
        } catch {
            return null
        }
    }
}