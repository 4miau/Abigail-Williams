import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

export default class StreamerPings extends Command {
    public constructor() {
        super('streamerpings', {
            aliases: ['streamerpings', 'streamerspings', 'liststreamerpings'],
            category: 'Twitch',
            description: {
                content: 'Lists all pings for a streamer on the watchlist.',
                usage: 'streamerpings [streamer-name]',
                examples: ['streamerpings notmiauu'],
            },
            channel: 'guild',
            ratelimit: 3,
            args: [
                {
                    id: 'streamerName',
                    type: 'string'
                }
            ]
        })
    }

    public exec(message: Message, {streamerName}: {streamerName: string}): Promise<Message> {
        if (!streamerName) return message.channel.send('You must provide a streamer to get the role pings of.')

        const streamers : {
            name: string, 
            message: string, 
            pings: string[], 
            posted: boolean
        }[] = this.client.settings.get(message.guild, 'twitch.twitch-streamers', {})

        if (!streamers.arrayEmpty()) {
            const roles: string[] = streamers.find(s => s.name === streamerName).pings.map(p => {
                if (p === '@everyone') return '"everyone"'
                return `"${message.guild.roles.resolve(p).name}"`
            })

            if (roles.arrayEmpty()) return message.channel.send(roles.join(', '))
            return message.channel.send('This streamer has no role pings.')
        }
        
        return message.channel.send('You have no streamers on the list, add some streamers to populate the list.')
    }
}