import { Command } from 'discord-akairo'
import { GuildMember, Message } from 'discord.js'
import ms from 'ms'
import { Repository } from 'typeorm'

import { Case } from '../../models/Case'
import { MemberData } from '../../models/MemberData'
import MemberDataManager from '../../structures/MemberDataManager'
import ModUtil from '../../util/ModUtil'

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
            userPermissions: ['VIEW_AUDIT_LOG'],
            clientPermissions: ['VIEW_AUDIT_LOG'],
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

    public async exec(message: Message, {member, reason}: {member: GuildMember, reason: string}): Promise<Message> {
        const caseRepo: Repository<Case> = this.client.db.getRepository(Case)
        const totalCases: number = this.client.settings.get(message.guild, 'totalCases', 0) + 1

        const memberDataRepo: Repository<MemberData> = this.client.db.getRepository(MemberData)       

        if (message.author.id === message.member.id && reason === 'Automod (Antieveryone)')
        if (member.roles.highest.position >= message.member.roles.highest.position && !reason.includes('Automod') || (message.author.id === message.guild.ownerID))
            return message.channel.send('I can\'t warn this user. They have roles above or equal to yours.')

        const newCase = new Case()

        newCase.guildID = message.guild.id
        newCase.messageID = message.id
        newCase.caseID = totalCases

        newCase.action = ModUtil.CONSTANTS.ACTIONS.WARN
        newCase.reason = reason
        
        newCase.targetID = member.user.id
        newCase.targetTag = member.user.tag
        newCase.modID = message.author.id === member.user.id ? this.client.user.id : message.author.id
        newCase.modTag = message.author.tag === member.user.tag ? this.client.user.tag : message.author.tag

        await caseRepo.save(newCase)

        this.client.settings.set(message.guild, 'totalCases', totalCases)

        const newMember = new MemberData()
        const oldMember = await memberDataRepo.findOne({ memberID: member.user.id })

        newMember.memberID = member.user.id
        newMember.activeWarns = oldMember ? oldMember.activeWarns + 1 : 1

        await this.client.memberDataManager.addWarn(newMember)

        const muteOnWarn = await memberDataRepo.findOne({ memberID: member.user.id })
        const muteRole = message.guild.roles.resolve(this.client.settings.get(message.guild, 'muteRole', ''))

        if (muteOnWarn && muteOnWarn.activeWarns % 3 === 0 && muteRole) {
            this.client.commandHandler.findCommand('mute').exec(message, { member: member, time: ms('3h'), reason: reason })
            return message.channel.send(`
            ${member.user.tag} has been warned ${member.user.tag === message.author.tag ? `for \*${reason}` : `by ${message.author.tag} for \*${reason}\*`}
            This user has been warned ${muteOnWarn.activeWarns} times and will now be muted.
            `)
        }

        return message.channel.send(`${member.user.tag} has been warned ${member.user.tag === message.author.tag ? `for \*${reason}\*` : `by ${message.author.tag} for \*${reason}\*`}`)
    }
}