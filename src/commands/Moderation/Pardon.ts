import { Command } from 'discord-akairo'
import { GuildMember, Message } from 'discord.js'

import Case from '../../models/Case'
import MemberData from '../../models/MemberData'
import ModUtil from '../../util/structures/ModUtil'

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

    //@ts-ignore
    userPermissions(message: Message) {
        const modRole = this.client.settings.get(message.guild, 'modRole', '')
        const hasStaffRole = message.member.permissions.has(['VIEW_AUDIT_LOG', 'MANAGE_ROLES'], true) || message.member.roles.cache.has(modRole)

        if (!hasStaffRole) return 'Moderator'
        return null
    }

    public async exec(message: Message, {member, reason}: {member: GuildMember, reason: string}): Promise<Message> {
        if (!member) return message.util.send('Okay... so who on earth am I supposed to pardon then?')

        const totalCases: number = this.client.settings.get(message.guild, 'totalCases', 0) + 1

        await new Case({
            id: await Case.countDocuments() + 1,
            guildID: message.guild.id,
            messageID: message.id,
            caseID: totalCases,

            action: ModUtil.CONSTANTS.ACTIONS.PARDON,
            reason: reason,

            targetID: member.user.id,
            targetTag: member.user.tag,
            modID: message.author.id === member.user.id ? this.client.user.id : message.author.id,
            modTag: message.author.tag === member.user.tag ? this.client.user.tag : message.author.tag
        }).save()

        this.client.settings.set(message.guild, 'totalCases', totalCases)

        const newMember = new MemberData()

        newMember.memberID = member.user.id
        newMember.memberTag = member.user.tag
        newMember.activeWarns -= 1

        await this.client.memberDataManager.pardonWarn(newMember)

        return message.channel.send(`${member.user.tag} has been pardoned a warning for reason: ${reason}`)
    }
}