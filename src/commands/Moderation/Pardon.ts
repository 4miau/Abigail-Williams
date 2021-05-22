import { Command } from 'discord-akairo'
import { GuildMember, Message } from 'discord.js'

import { Case } from '../../models/Case'
import { MemberData } from '../../models/MemberData'
import ModUtil from '../../util/ModUtil'

export default class Pardon extends Command {
    public constructor() {
        super('pardon', {
            aliases: ['pardon', 'excuse'],
            category: 'Moderation',
            description: {
                content: 'Relinquishes a warning from a user.',
                usage: 'pardon [user] <reason>',
                examples: ['pardon miau false warn'],
            },
            channel: 'guild',
            userPermissions: ['MANAGE_GUILD'],
            ratelimit: 3,
            args: [
                {
                    id: 'member',
                    type: 'member'
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
        if (!member) return message.util!.send('Okay... so who on earth am I supposed to pardon then?')

        const caseRepo = this.client.db.getRepository(Case)
        const totalCases: number = this.client.settings.get(message.guild, 'totalCases', 0) + 1

        const newCase = new Case()

        newCase.guildID = message.guild.id
        newCase.messageID = message.id
        newCase.caseID = totalCases

        newCase.action = ModUtil.CONSTANTS.ACTIONS.PARDON
        newCase.reason = reason
        
        newCase.targetID = member.user.id
        newCase.targetTag = member.user.tag
        newCase.modID = message.author.id === member.user.id ? this.client.user.id : message.author.id
        newCase.modTag = message.author.tag === member.user.tag ? this.client.user.tag : message.author.tag

        await caseRepo.save(newCase)

        this.client.settings.set(message.guild, 'totalCases', totalCases)

        const newMember = new MemberData()

        newMember.memberID = member.user.id
        newMember.activeWarns -= 1

        await this.client.memberDataManager.pardonWarn(newMember)

        return message.channel.send(`${member.user.tag} has been pardoned a warning for reason: ${reason}`)
    }
}