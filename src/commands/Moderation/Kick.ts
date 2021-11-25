import { Command } from 'discord-akairo'
import { Message, GuildMember } from 'discord.js'

import Case from '../../models/Case'
import ModUtil from '../../util/structures/ModUtil'

export default class Kick extends Command {
    public constructor() {
        super('kick', {
            aliases: ['kick'],
            category: 'Moderation',
            description: {
                    content: 'Kicks a user from the server.',
                    usage: 'kick [@user] <reason>',
                    examples: ['kick @user', 'kick @user swearing too much.']
            },
            channel: 'guild',
            ratelimit: 3,
            args: [
                {
                    id: 'member',
                    type: 'member',
                    prompt: {
                        start: (msg: Message) => `${msg.author}, please provide a member to kick...`,
                        retry: (msg: Message) => `${msg.author}, please provide a valid member to kick...`,
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

        if (!member.kickable) return message.channel.send('I am unable to kick that user.')

        await member.kick(reason)
        this.client.settings.set(message.guild, 'totalCases', totalCases)

        const newCase = await new Case({
            id: await Case.countDocuments(),
            guildID: message.guild.id,
            messageID: message.id,
            caseID: totalCases,

            action: ModUtil.CONSTANTS.ACTIONS.KICK,
            reason: reason,

            targetID: member.user.id,
            targetTag: member.user.tag,
            modID: message.author.id,
            modTag: message.author.tag,
        }).save()

        return message.channel.send(`${member.user.tag} (${member.user.id}) has been kicked from the server successfully.`)
            .then(msg => {
                setTimeout(() => { msg.delete() }, 5000)
                return msg
            })
    }
}