import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

import { _GetUserByName } from '../../util/functions/twitch'

export default class RemoveStreamer extends Command {
    public constructor() {
        super('removestreamer', {
            aliases: ['removestreamer', 'streamer remove', 'deletestreamer'],
            category: 'Twitch',
            description: {
                content: 'Removes a user to the notification list of Twitch Channels.',
                usage: 'removestreamer [streamer-name]',
                examples: ['removestreamer notmiauu']
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
        if (!streamerName) return message.channel.send('Provide a streamer to remove from the watchlist.')

        const streamer = await _GetUserByName(streamerName)
        const streamers : {
            name: string, 
            message: string, 
            pings: string[], 
            posted: boolean
        }[] = this.client.settings.get(message.guild, 'twitch.twitch-streamers', {})

        if (!streamers.find(tu => tu.name === streamerName)) return message.channel.send('This streamer is not on the watchlist.')
        else {
            await this.client.settings.set(message.guild, 'twitch.twitch-streamers', streamers.filter(tu => tu.name !== streamerName))
            return message.channel.send(`${streamer.broadcaster_login} has been removed from the server's channel watchlist.`)
        }
    }
}