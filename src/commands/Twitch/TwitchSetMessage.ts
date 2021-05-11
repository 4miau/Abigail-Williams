import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

export default class TwitchSetMessage extends Command {
    public constructor() {
        super('twitchsetmessage', {
            aliases: ['twitchmessage', 'twitchsetmessage'],
            category: 'Twitch',
            description: {
                content: 'Sets a custom twitch message for a streamer',
                usage: 'twitchmessage [streamername] [message]',
                examples: ['twitchmesage notmiauu Now streaming here! {link}'],
                tags: ['{link} = Stream link', '{name} = Streamer name', '{game} = Streamer game playing', '{everyone} = @everyone', '{role [rolename]} = @rolename']
            },
            ownerOnly: true,
            userPermissions: ['MANAGE_GUILD'],
            ratelimit: 3,
            args: [
                {
                    id: 'streamer',
                    type: 'string',
                    match: 'phrase'
                },
                {
                    id: 'streamMessage',
                    type: 'string',
                    match: 'rest'
                }
            ]
        })
    }

    public exec(message: Message, {streamer, streamMsg}: {streamer: string, streamMsg: string}): Promise<Message> {
        if (!streamer) return message.util!.send('Please provide a streamer to check for.')
        if (!streamMsg) return message.util!.send('You should provide a stream message.')

        return message.util!.send('Will do this later.')
    }
}