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
            userPermissions: ['VIEW_AUDIT_LOG'],
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

/*
        const perPage = 5
        page = player.queue.length ? page : 1

        const end = page * perPage
        const start = end - perPage

        const tracks = queue.slice(start, end)

        if (queue.current) { e.addField("Current", `[${queue.current.title}](${queue.current.uri}) request by: ${queue.current.requester}`) }

        if (!tracks.length) e.setDescription(`No tracks in ${page > 1 ? `page ${page}` : "the queue"}.`)
        else e.setDescription(tracks.map((track, i) => `${start + (++i)} - [${track.title}](${track.uri}) request by: ${queue.current.requester}`).join("\n"))

        const maxPages = Math.ceil(queue.length / perPage)
*/