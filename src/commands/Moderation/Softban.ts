import { Command } from 'discord-akairo'
import { GuildMember, Message } from 'discord.js'

import Case from '../../models/Case'
import ModUtil from '../../util/structures/ModUtil'

export default class Softban extends Command {
    public constructor() {
        super('softban', {
            aliases: ['softban'],
            category: 'Moderation',
            description: {
                content: 'Bans a user and immediately unbans them to clear message history.',
                usage: 'softban [@user] [reason]',
                examples: ['softban user being toxic'],
            },
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
        const hasStaffRole = message.member.permissions.has('BAN_MEMBERS', true) || message.member.roles.cache.has(modRole)

        if (!hasStaffRole) return 'Moderator'
        return null
    }

    public async exec(message: Message, {member, reason}: {member: GuildMember, reason: string}): Promise<Message> {
        const totalCases: number = this.client.settings.get(message.guild, 'totalCases', 0) + 1

        if (!member) return message.channel.send('Yo must provide a member to softban...')
        if (!member.bannable) return message.channel.send('I do not have the permissions to ban this user.')

        await message.channel.send('Softbanning user...')

        await new Case({
            id: await Case.countDocuments() + 1,
            guildID: message.guild.id,
            messageID: message.id,
            caseID: totalCases,

            action: ModUtil.CONSTANTS.ACTIONS.SOFTBAN,
            reason: reason,

            targetID: member.user.id,
            targetTag: member.user.tag,
            modID: message.author.id,
            modTag: message.author.tag
        }).save()

        this.client.settings.set(message.guild, 'totalCases', totalCases)

        await member.ban({ days: 7, reason: reason }).then(bu => message.guild.members.unban(bu))
        return message.channel.send(`${member.user.tag} has been softbanned.`)

    }
}