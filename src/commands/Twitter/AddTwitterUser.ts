import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

import { _GetTwitterUser, _GetUserLatestPosts } from '../../util/Functions'

export default class AddTwitterUser extends Command {
    public constructor() {
        super('addtwitteruser', {
            aliases: ['addtwitteruser', 'twittersub', 'addtweeter'],
            category: 'Twitter',
            description: {
                content: 'Posts updates from a twitter user into a channel.',
                usage: 'addtwitteruser [username]',
                examples: ['addtwitteruser vgmiau'],
            },
            userPermissions: ['ADMINISTRATOR'],
            ratelimit: 3,
            args: [
                {
                    id: 'username',
                    type: 'string',
                    match: 'rest'
                }
            ]
        })
    }

    public async exec(message: Message, {username}: {username: string}): Promise<Message> {
        if (!username) return message.util!.send('You need to provide a twitter user\'s username.')

        const twitterUser = await _GetTwitterUser(username)

        if (!twitterUser) return message.util!.send('Unable to find this user, please try again.')

        let twitterUsers: {
            id: string,
            name: string,
            pinnedTweet: string,
            latestPost: string
        }[] = this.client.settings.get(message.guild, 'twitter.twitter-users', [])

        if (twitterUsers.find(tu => tu.name.toLowerCase() === username.toLowerCase())) return message.util!.send(`${twitterUser.username} is already on the twitter subscription list!`)
        else {
            twitterUsers.push({
                id: twitterUser.data.id,
                name: twitterUser.username,
                pinnedTweet: twitterUser.pinned_tweet_id ? twitterUser.pinned_tweet_id : null,
                latestPost: await _GetUserLatestPosts(twitterUser.data.id) ? 
                    await _GetUserLatestPosts(twitterUser.data.id)
                        .then(tu => tu.data[0].id) : null
            })
        }
        this.client.settings.set(message.guild, 'twitter.twitter-users', twitterUsers)

        return message.util!.send(`${twitterUser.username} has been added to the twitch user watchlist.`)
    }
}