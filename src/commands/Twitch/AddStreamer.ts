import { Command } from "discord-akairo";
import { Message } from "discord.js";

import { streamDefaultMessage } from "../../util/Constants";
import { _GetUserByName } from "../../util/Functions";

export default class AddStreamer extends Command {
    public constructor() {
        super('addstreamer', {
            aliases: ['addstreamer', 'streamer add'],
            category: 'Twitch',
            description: {
                content: 'Adds a streamer to the notification list of Twitch Channels.',
                usage: 'addstreamer [streamer-name]',
                examples: ['addstreamer user notmiauu']
            },
            ownerOnly: true,
            userPermissions: ['MANAGE_GUILD'],
            ratelimit: 3,
            args: [
                {
                    id: 'streamerName',
                    type: 'string'
                }
            ]
        })
    }

    public async exec(message: Message, {streamerName}: {streamerName: string}): Promise<Message> {
        if (!streamerName) return message.util!.send('You need to provide a streamer to add to the list.')

        const streamer = await _GetUserByName(streamerName)
        if (!streamer) return message.util!.send('Failed to find that user. Please try again.')

        let twitchUsers: {
            name: string, 
            message: string, 
            pings: string[], 
            posted: boolean}[] = this.client.settings.get(message.guild, 'twitch.twitch-streamers', [])

            
        if (twitchUsers.find(tu => tu.name === streamerName)) return message.util!.send(`${streamer.broadcaster_login} is already on the server watchlist!`)
        else {
            twitchUsers.push({ 
                name: streamer.broadcaster_login,
                message: streamDefaultMessage,
                pings: [],
                posted: false
            })

            await this.client.settings.set(message.guild, 'twitch.twitch-streamers', twitchUsers)
            return message.util!.send(`${streamer.broadcaster_login} has been added to the twitch user watchlist.`)
        }
    }
}