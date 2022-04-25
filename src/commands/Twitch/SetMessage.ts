import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

export default class SetMessage extends Command {
    public constructor() {
        super('twitchsetmessage', {
            aliases: ['setmessage', 'twitchmessage', 'setstreammessage', 'twitchsetmessage'],
            category: 'Twitch',
            description: {
                content: 'Sets a custom twitch message for a streamer',
                usage: 'setmessage [streamerName/streamerID] [message]',
                examples: ['twitchmesage 4miau Now streaming here! {link}', 'twitchmessage 12345678 Streaming here! {link} -embed'],
                tags: [
                    '{title} = Stream title',
                    '{name} = Streamer name', 
                    '{game} = Streamer game playing',  
                    '{link} = Stream link',
                    '-embed = Adds an embed (must be at the end)'
                ]
            },
            channel: 'guild',
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

    //@ts-ignore
    userPermissions(message: Message) {
        const modRole = this.client.settings.get(message.guild, 'modRole', '')
        const hasStaffRole = message.member.permissions.has('ADMINISTRATOR', true) || message.member.roles.cache.has(modRole)

        if (!hasStaffRole) return 'Server administrator or staff role'
        return null
    }

    public async exec(message: Message, {streamer, streamMessage}: {streamer: string, streamMessage: string}): Promise<Message> {
        if (!streamer) return message.channel.send('Please provide a streamer to check for.')
        if (!streamMessage) return message.channel.send('You should provide a stream message.')

        const streamers: Streamer[] = this.client.settings.get(message.guild, 'streamers', [])

        if (!streamers.arrayEmpty()) {
            try {
                streamers.find(s => s.name === streamer || s.id === streamer).message = streamMessage
                this.client.settings.set(message.guild, 'streamers', streamers)
                return message.channel.send('I have updated the stream message for this streamer!')
            } catch (err) {
                return message.channel.send('That streamer is not on the list!')
            }
        } else {
            return message.channel.send('You need to add streamers onto the list first.')
        }
    }
}