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
        const modRole: string = this.client.settings.get(message.guild, 'modRole', '')
        const hasStaffRole = message.member.hasPermission('VIEW_AUDIT_LOG', { checkAdmin: true, checkOwner: true}) || message.member.roles.cache.has(modRole)

        if (!hasStaffRole) return 'Moderator'
        return null
    }

    public async exec(message: Message, {page}: {page: number}): Promise<Message> {
        const banList = await message.guild.fetchBans()
            .then(bCol => bCol.map(b => b))

        const perPage = 10
        const maxPages = Math.ceil(banList.length / perPage)

        page = banList.length ? page : 1

        const end = page * perPage
        const start = end - perPage

        const bans = banList.slice(start, end)

        const e = new MessageEmbed()
            .setAuthor(`${message.guild.name} | Bans`, message.guild.iconURL())
            .setFooter(`Page ${page > maxPages ? maxPages : page} of ${maxPages}`)
        
        if (!bans.length) e.setDescription(`No bans in ${page > 1 ? `page ${page}` : `this server.`}`)
        else e.setDescription(bans.map((b, i) => `${start + (++i)} - User: ${b.user.tag} (${b.user.id})\nReason: ${b.reason ? b.reason : 'No reason specified'}`).join('\n\n'))

        return await message.util!.send(e)
    }
}