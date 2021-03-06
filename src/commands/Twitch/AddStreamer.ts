import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

import { streamDefaultMessage } from '../../util/Constants'

export default class AddStreamer extends Command {
    public constructor() {
        super('addstreamer', {
            aliases: ['addstreamer'],
            category: 'Twitch',
            description: {
                content: 'Adds a streamer to the notification list of Twitch Channels.',
                usage: 'addstreamer [streamerName]',
                examples: ['addstreamer user 4miau']
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

    //@ts-ignore
    userPermissions(message: Message) {
        const modRole = this.client.settings.get(message.guild, 'modRole', '')
        const hasStaffRole = message.member.permissions.has('ADMINISTRATOR', true) || message.member.roles.cache.has(modRole)

        if (!hasStaffRole) return 'Server administrator or staff role'
        return null
    }

    public async exec(message: Message, {streamerName}: {streamerName: string}): Promise<Message> {
        if (!streamerName) return message.channel.send('You need to provide a streamer to add to the list.')
        
        const getStreamer = this.client.serviceHandler.modules.get('getuserbyname')

        const streamer = await getStreamer.exec(streamerName)
        if (!streamer) return message.channel.send('Failed to find that user. Please try again.')

        const streamers: Streamer[] = this.client.settings.get(message.guild, 'streamers', [])
            
        if (streamers.find(tu => tu.name === streamerName)) return message.channel.send(`${streamer.broadcaster_login} is already on the server watchlist!`)
        else {
            streamers.push({ id: streamer.id, name: streamer.broadcaster_login, message: streamDefaultMessage, pings: [], posted: false })

            this.client.settings.set(message.guild, 'streamers', streamers)
            return message.channel.send(`${streamer.broadcaster_login} has been added to the twitch user watchlist.`)
        }
    }
}