import { Argument, Command } from 'discord-akairo'
import { GuildMember, Message } from 'discord.js'

import { defaultPrefix } from '../../Config'
import { Case } from '../../models/Case'
import { maxMuteTime, minMuteTime } from '../../util/Constants'
import ModUtil from '../../util/ModUtil'

export default class Mute extends Command {
    public constructor() {
        super('mute', {
            aliases: ['mute', 'silence', 'shadowrealm'],
            category: 'Moderation',
            description: {
                    content: 'Mute a user from being able to talk.',
                    usage: 'mute [@user} <time> <reason>',
                    examples: ['mute @user bullying']
            },
            channel: 'guild',
            userPermissions: ['MUTE_MEMBERS'],
            clientPermissions: ['MANAGE_ROLES'],
            ratelimit: 3,
            args: [
                {
                    id: 'member',
                    type: 'member',
                    prompt: {
                        start: (msg: Message) => `${msg.author}, please provide a member to mute.`,
                        retry: (msg: Message) => `${msg.author}, please provide a valid member to mute...`,
                        cancel: () => 'The command has been cancelled.'
                    }
                },
                {
                    id: 'time',
                    type: Argument.range('time', minMuteTime, maxMuteTime, true),
                    match: 'phrase',
                    default: 0
                },
                {
                    id: 'reason',
                    type: 'string',
                    match: 'rest',
                    default: 'No reason specified'
                }
            ]
        })
    }

    public async exec(message: Message, { member, time, reason}: {member: GuildMember, time: number, reason: string}): Promise<Message> {
        const totalCases: number = this.client.settings.get(message.guild, 'totalCases', 0) + 1
        const muteRole = message.guild.roles.resolve(this.client.settings.get(message.guild, 'muteRole', ''))

        if (!muteRole) return message.util!.send('You need to set a mute role before being able to mute a user.')
        if (!muteRole.editable) return message.util!.send('I am unable to give the mute role to members. Please make sure my role is above this role.')
        if (member.id === message.author.id) return message.util!.send('You can not mute yourself.')
        if (member.roles.cache.some(r => r === muteRole)) return message.util!.send('This member is already muted!')

        try {
            await member.roles.add(muteRole, `Muted by ${message.author.tag} | Case ${totalCases}`)

            const newCase = new Case()

            newCase.guildID = message.guild.id
            newCase.messageID = message.id
            newCase.caseID = totalCases
    
            newCase.action = ModUtil.CONSTANTS.ACTIONS.MUTE
            newCase.actionComplete = false
            time !== 0 ? newCase.actionDuration = new Date(Date.now() + time) : void 0
            newCase.reason = reason
            
            newCase.targetID = member.user.id
            newCase.targetTag = member.user.tag
            newCase.modID = message.author.id
            newCase.modTag = message.author.tag

            await this.client.muteManager.addMute(newCase)
            this.client.settings.set(message.guild, 'totalCases', totalCases)

            const prefix = this.client.settings.get(message.guild, 'prefix', '')
            if (!reason) message.channel.send(`You have not set a reason, use \`${prefix ? prefix : defaultPrefix}reason ${totalCases} [reason]\` to set a reason for this case.`)
            return message.util!.send(`Muted ${member}`)
        } catch (err) {
            return message.util!.send('I do not have permission to be able to mute this user.')
        }
    }
}