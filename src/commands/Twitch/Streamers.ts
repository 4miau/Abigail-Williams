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
            ratelimit: 3,
        })
    }

    public exec(message: Message): Promise<Message> {
        const streamerList: {
            name: string,
            message: string,
            pings: string[],
            posted: boolean }[] = this.client.settings.get(message.guild, 'twitch.twitch-streamers', [])

        if (streamerList.length > 0) {
            let nameList: string[] = []
            for (const streamer of streamerList) nameList.push(streamer.name)

            this.client.logger.log('ERROR', `${streamerList.length} is empty however it passes the truthy test.`)

            return message.util!.send(nameList.join('\n'))
        }

        return message.util!.send('You have no streamers on the list, add some streamers to populate the list.')
    }
}