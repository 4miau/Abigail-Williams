import { Command } from "discord-akairo";
import { Message } from "discord.js";

import { _GetUser } from "../../utils/Functions";

export default class TwitchAddUser extends Command {
    public constructor() {
        super('twitchadduser', {
            aliases: ['twitchadduser', 'twitchadd user'],
            category: 'Twitch',
            description: {
                content: 'Adds a user to the notification list of Twitch Channels.',
                usage: 'twitchadd [streamer-name]',
                examples: ['twitchadd user notmiauu']
            },
            ownerOnly: true,
            userPermissions: ['MANAGE_GUILD'],
            ratelimit: 3,
            args: [
                {
                    id: 'streamer',
                    type: 'string'
                }
            ]
        })
    }

    public async exec(message: Message, {streamer}: {streamer: string}): Promise<Message> {
        if (streamer) {
            const findUser = await _GetUser(streamer)

            if (findUser) {
                let twitchUsers: string[] = this.client.settings.get(message.guild, 'twitch.twitch-users', [])
                if (twitchUsers.includes(findUser.id)) return message.util!.send(`${findUser.broadcaster_login} is already on the server watchlist!`)
                else {
                    twitchUsers.push(findUser.id)
                    await this.client.settings.set(message.guild, 'twitch.twitch-users', twitchUsers)
                    return message.util!.send(`${findUser.broadcaster_login} has been added to the twitch user watchlist.`)
                }
            }

            return message.util!.send('Failed to find that user. Please try again.')
        }

        return message.util!.send('Please provide a streamer to search for.')

    }
}