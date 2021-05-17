import { Command } from 'discord-akairo'
import { Message, MessageEmbed, VoiceChannel } from 'discord.js'
import { Colours } from '../../util/Colours'

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

    public exec(message: Message, {page}: {page: number}): Promise<Message> {
        const userVC = message.member.voice.channel

        if (!userVC) return message.util!.send('You must be in the same VC to play a song.')

        const players = this.client.manager.players.size
        if (!players) return message.util!.send('I am currently not in a voice channel.')

        const player = this.client.manager.players.first()

        const queue = player.queue

        const e = new MessageEmbed()
            .setAuthor(`Queue for ${(message.guild.channels.resolve(player.voiceChannel) as VoiceChannel).name}`)
            .setImage(`https://img.youtube.com/vi/${queue.current.identifier}/maxresdefault.jpg`)

        const perPage = 5
        page = player.queue.length ? page : 1

        const end = page * perPage
        const start = end - perPage

        const tracks = queue.slice(start, end)

        if (queue.current) { e.addField("Current", `[${queue.current.title}](${queue.current.uri}) request by: ${queue.current.requester}`) }

        if (!tracks.length) e.setDescription(`No tracks in ${page > 1 ? `page ${page}` : "the queue"}.`)
        else e.setDescription(tracks.map((track, i) => `${start + (++i)} - [${track.title}](${track.uri}) request by: ${queue.current.requester}`).join("\n"))

        const maxPages = Math.ceil(queue.length / perPage)

        e.setFooter(`Page ${page > maxPages ? maxPages : page} of ${maxPages} | Overlooked by yettyy`)

        return message.channel.send(e)
    }
}