import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

export default class Streamers extends Command {
    public constructor() {
        super('streamers', {
            aliases: ['streamers', 'liststreamers', 'streamerlist'],
            category: 'Twitch',
            description: {
                content: 'Lists all the streamers that are currently on the watchlist.',
                usage: 'streamers',
                examples: ['streamers'],
            },
            channel: 'guild',
            ratelimit: 3,
        })
    }

    public exec(message: Message): Promise<Message> {
        const streamers: Streamer[] = this.client.settings.get(message.guild, 'streamers', [])

        if (!streamers.arrayEmpty()) {
            const streamerList: { name: string, id: string }[] = [] 
            for (const streamer of streamers) streamerList.push({ name: streamer.name, id: streamer.id })

            return message.channel.send(streamerList.map(s => `${s.name} (${s.id})`).join('\n'))
        }

        return message.channel.send('You have no streamers on the list, add some streamers to populate the list.')
    }
}