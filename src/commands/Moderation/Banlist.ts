import { Command } from 'discord-akairo'
import { Message, MessageEmbed } from 'discord.js'

export default class Banlist extends Command {
    public constructor() {
        super('banlist', {
            aliases: ['banlist', 'bans', 'getbans', 'serverbans'],
            category: 'Moderation',
            description: {
                content: 'Gets the current banlist.',
                usage: 'banlist [page]',
                examples: ['banlist', 'banlist 3'],
            },
            channel: 'guild',
            ratelimit: 3,
            args: [
                {
                    id: 'page',
                    type: (_: Message, str: string): number => {
                        if (str && Number(str)) if (Number(str) > 0) return Number(str)
                        return 1
                    }
                }
            ]
        })
    }

    //@ts-ignore
    userPermissions(message: Message) {
        const modRole = this.client.settings.get(message.guild, 'modRole', '')
        const hasStaffRole = message.member.permissions.has('VIEW_AUDIT_LOG', true) || message.member.roles.cache.has(modRole)

        if (!hasStaffRole) return 'Moderator'
        return null
    }

    public async exec(message: Message, {page}: {page: number}): Promise<Message> {
        const banList = await message.guild.bans.fetch().then(bans => bans.map(b => b))

        const bans = banList.paginate(page, 10)
        const start = (!isNaN(page) ? page - 1 : 0) * bans[1] 

        const e = new MessageEmbed()
            .setAuthor(`${message.guild.name} | Bans`, message.guild.iconURL())
            .setFooter(`Page ${page > bans[1] ? bans[1] : page} of ${bans[1]}`)
        
        if (!bans.length) e.setDescription('No bans in' + (page > 1 ? `page ${page}` : 'this server.'))
        else e.setDescription(bans[0].map((b, i) => `${start + (++i)} - User: ${b.user.tag} (${b.user.id})\nReason: ${b.reason ? b.reason : 'No reason specified'}`).join('\n\n'))

        return await message.util.send({ embeds: [e] })
    }
}