import { Command } from "discord-akairo";
import { Message } from "discord.js";
import axios from 'axios'

import { twitchClientID, twitchClientSecret } from "../../Config";

export default class TwitchRemoveUser extends Command {
    public constructor() {
        super('twitchremoveuser', {
            aliases: ['twitchremove', 'twitchremove user'],
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
            const token = await axios.post(`https://id.twitch.tv/oauth2/token?client_id=${twitchClientID}&client_secret=${twitchClientSecret}&grant_type=client_credentials`)
            .then(res => res.data.access_token)
            .catch(void 0)

            const findUser = await axios.get(`https://api.twitch.tv/helix/search/channels?query=${streamer}`, {
                'headers': {
                    'client-id': twitchClientID,
                    'Authorization': `Bearer ${token}`
                },
                'method': 'GET'
            })
            .then(async res => {
                const user = res.data.data.find((user: any) => user.broadcaster_login === streamer)
                if (user) return user
                else return void 0
            })
            .catch(void 0)

            if (findUser) {
                let twitchUsers: string[] = this.client.settings.get(message.guild, 'twitch-users', [])
                if (!twitchUsers.includes(findUser.id)) return message.util!.send('This user is not on the server watchlist')
                else {
                    twitchUsers = twitchUsers.filter(uid => uid !== findUser.id)
                    await this.client.settings.set(message.guild, 'twitch-users', twitchUsers)
                    return message.util!.send(`${findUser.broadcaster_login} has been removed from the server's user watchlist.`)
                }
            }

            return message.util!.send('Failed to find that user. Please try again.')
        }

        return message.util!.send('Please provide a streamer to search for.')
    }
}