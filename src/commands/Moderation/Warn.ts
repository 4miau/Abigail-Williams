import { Command } from 'discord-akairo'
import { GuildMember, Message } from 'discord.js'
import ms from 'ms'

import Case from '../../models/Case'
import MemberData from '../../models/MemberData'
import ModUtil from '../../util/structures/ModUtil'

export default class Warn extends Command {
    public constructor() {
        super('warn', {
            aliases: ['warn'],
            category: 'Moderation',
            description: {
                    content: 'Warns a user',
                    usage: 'warn [@user] <reason>',
                    examples: ['warn @user spamming']
            },
            channel: 'guild',
            ratelimit: 3,
            args: [
                {
                    id: 'member',
                    type: 'member',
                    prompt: {
                        start: (msg: Message) => `${msg.author}, please provide a member to warn...`,
                        retry: (msg: Message) => `${msg.author}, please provide a valid member to warn...`,
                        cancel: () => 'This command has now been cancelled.'
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
        const hasStaffRole = message.member.permissions.has(['VIEW_AUDIT_LOG', 'KICK_MEMBERS'], true) || message.member.roles.cache.has(modRole)

        if (!hasStaffRole) return 'Moderator'
        return null
    }

    public async exec(message: Message, {member, reason}: {member: GuildMember, reason: string}): Promise<Message> {
        const totalCases: number = this.client.settings.get(message.guild, 'totalCases', 0) + 1    

        if (message.author.id === message.member.id && reason === 'Automod (Antieveryone)')
            if (member.roles.highest.position >= message.member.roles.highest.position && !reason.includes('Automod') || (message.author.id === message.guild.ownerId))
                return message.channel.send('I can\'t warn this user. They have roles above or equal to yours.')

        await new Case({
            id: await Case.countDocuments() + 1,
            guildID: message.guild.id,
            messageID: message.id,
            caseID: totalCases,

            action: ModUtil.CONSTANTS.ACTIONS.WARN,
            reason: reason,

            targetID: member.user.id,
            targetTag: member.user.tag,
            modID: message.author.id === member.user.id ? this.client.user.id : message.author.id,
            modTag: message.author.tag === member.user.tag ? this.client.user.tag : message.author.tag
        }).save()

        this.client.settings.set(message.guild, 'totalCases', totalCases)

        const newMember = new MemberData()
        const oldMember = await MemberData.findOne({ memberID: member.user.id })

        newMember.memberID = member.user.id
        newMember.memberTag = member.user.tag
        newMember.activeWarns = oldMember ? oldMember.activeWarns + 1 : 1

        await this.client.memberDataManager.addWarn(newMember)

        const muteOnWarn = await MemberData.findOne({ memberID: member.user.id })
        const muteRole = message.guild.roles.resolve(this.client.settings.get(message.guild, 'muteRole', ''))

        if (muteOnWarn && muteOnWarn.activeWarns % 3 === 0 && muteRole) {
            this.client.commandHandler.findCommand('mute').exec(message, { member: member, time: ms('3h'), reason: reason })
            return message.channel.send(`
            ${member.user.tag} has been warned ${member.user.tag === message.author.tag ? `for *${reason}*` : `by ${message.author.tag} for *${reason}*`}
            This user has been warned ${muteOnWarn.activeWarns} times and will now be muted.
            `)
        }

        return message.channel.send(`${member.user.tag} has been warned ${member.user.tag === message.author.tag ? `for *${reason}*` : `by ${message.author.tag} for *${reason}*`}`)
    }
}