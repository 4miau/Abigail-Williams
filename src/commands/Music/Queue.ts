import { Command } from 'discord-akairo'
import { Message, MessageEmbed, VoiceChannel } from 'discord.js'

export default class Queue extends Command {
    public constructor() {
        super('queue', {
            aliases: ['queue', 'getqueue', 'q'],
            category: 'Music',
            description: {
                content: 'Gets the current queue.',
                usage: 'queue',
                examples: ['queue'],
            },
            channel: 'guild',
            ratelimit: 3,
            args: [
                {
                    id: 'page',
                    type: (_: Message, str: string): number => {
                        if (Number(str)) return Number(str)
                        return 1
                    }
                }
            ]
        })
    }

    //@ts-ignore
    userPermissions(message: Message) {
        const djRole: string = this.client.settings.get(message.guild, 'djRole', '')
        if (!djRole) return null

        const hasDJRole = message.member.roles.cache.has(djRole)
        if (!hasDJRole) return 'DJ Role'
        return null
    }

    public async exec(message: Message, {page}: {page: number}): Promise<Message> {
        const queue = await this.client.music.guildQueue(message.guild)

        if (!queue.songs.length) return message.channel.send('There are no songs in the queue.')

        const e = new MessageEmbed()
            .setAuthor(`Queue for #${message.guild.me.voice.channel.name}`)
            .setImage(queue.songs[0].thumbnail)

        const songs = queue.songs.paginate(page, 5) // [data: Song[], maxPages: number]
        const start = (!isNaN(page) ? page - 1 : 0) * songs[1] 

        if (queue.nowPlaying) e.addField('Current', `[${queue.nowPlaying.name}](${queue.nowPlaying.url}) requested by ${message.author.tag}`)

        if (!songs.length) e.setDescription(`No tracks in ${page > 1 ? `page ${page}` : 'the queue'}`)
        else e.setDescription(
            songs[0].map((song, i) => `${start + (++i)} - [${song.name}](${song.url}) requested by: ${message.author.tag}`).join('\n')
        ) //(songs[1] * page) is a calculation to get the start of the page, e.g. page 5 where perPage is 6, 6 * 5 means the starting song is the 30th song.

        e.setFooter(`Page ${page > songs[1] ? songs[1] : page} of ${songs[1]} | Overlooked by yettyy`)

        return message.channel.send({ embeds: [e] })
    }
}