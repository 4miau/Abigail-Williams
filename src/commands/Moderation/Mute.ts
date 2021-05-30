import { Command, Argument } from 'discord-akairo'
import { GuildMember, Message } from 'discord.js'
import ms from 'ms'

import { Case } from '../../models/Case'
import { maxMuteTime, minMuteTime } from '../../util/Constants'
import ModUtil from '../../util/ModUtil'

export default class Mute extends Command {
    public constructor() {
        super('mute', {
            aliases: ['mute', 'silence', 'shadowrealm'],
            category: 'Moderation',
            description: {
                content: 'Mute a user from being able to talk. (Note: Max days is 30d, min is 1 minute, if you go outside this boundary no timer is set)',
                usage: 'muteremake [member] <time> <reason>',
                examples: ['muteremake @user 3d Failed to follow rules', 'muteremake @user Failed to follower rules', 'muteremake @user', 'muteremake @user 3h'],
            },
            ownerOnly: true,
            channel: 'guild',
            ratelimit: 3
        })
    }

    *args() {
        const member = yield {
           index: 0,
           type: 'member',
           prompt: {
                start: (msg: Message) => `${msg.author}, please provide a member to mute.`,
                retry: (msg: Message) => `${msg.author}, please provide a valid member to mute...`,
                cancel: () => 'The command has been cancelled.'
           }
        }

        let days = yield {
            index: 1,
            type: Argument.union('time', 'string'),
            match: 'phrase',
            default: 0
        }

        const reason = yield {
            index: 2,
            type: (_: Message, content: string) => {
                if (days && !Number(days)) {
                    content = days + ' ' + content
                    days = null
                    return content
                }
                if (!content) return null
                return content
            },
            match: 'rest',
            default: 'No reason specified'
        }

        if (days < minMuteTime || days > maxMuteTime) days = null
        if (!Number(days) || !Number(ms(days))) days = null

        return { member, days, reason }
    }

    public async exec(message: Message, {member, time, reason}: {member: GuildMember, time: number, reason: string}): Promise<Message> {
        const totalCases: number = this.client.settings.get(message.guild, 'totalCases', 0) + 1
        const muteRole = message.guild.roles.resolve(this.client.settings.get(message.guild, 'muteRole', ''))

        if (!muteRole || !muteRole.editable) return message.util!.send('You need to set a mute role first. And if you have, my role needs to be above it.')
        else if (!member) return message.util!.send('You need to provide a member to mute.')
        else if (member.user.id === message.author.id) return message.util!.send('You can\'t mute yourself silly!')
        else if (member.roles.highest.position > message.guild.me.roles.highest.position) return message.util!.send('I do not have permission to be able to mute this user.')
        else if (member.roles.cache.some(r => r === muteRole)) return message.util!.send('This member is already muted!')

        await member.roles.add(muteRole, `Muted by ${message.author.tag} | Case ${totalCases}`)

        const newCase = new Case()

        newCase.guildID = message.guild.id
        newCase.messageID = message.id
        newCase.caseID = totalCases

        newCase.action = ModUtil.CONSTANTS.ACTIONS.MUTE
        newCase.actionComplete = false
        time ? newCase.actionDuration = new Date(Date.now() + time) : void 0
        newCase.reason = reason
        
        newCase.targetID = member.user.id
        newCase.targetTag = member.user.tag
        newCase.modID = message.author.id
        newCase.modTag = message.author.tag

        await this.client.muteManager.addMute(newCase)
        this.client.settings.set(message.guild, 'totalCases', totalCases)

        const prefix = this.client.settings.get(message.guild, 'prefix', 'a.')
        if (!reason) message.channel.send(`You have not set a reason, use \`${prefix}reason ${totalCases} [reason]\` to set a reason for this case.`)

        message.delete({ timeout: 3000 })
        await message.util!.send(`Muted ${member}. Reason: ${reason}`)
    }
}