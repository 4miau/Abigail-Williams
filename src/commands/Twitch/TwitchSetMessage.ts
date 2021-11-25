import { Command } from 'discord-akairo'
import { Message } from 'discord.js'
import { _GetUserByName } from '../../util/functions/twitch'

export default class TwitchSetMessage extends Command {
    public constructor() {
        super('twitchsetmessage', {
            aliases: ['twitchsetmessage', 'twitchmessage', 'setstreammessage', 'setstreamm'],
            category: 'Twitch',
            description: {
                content: 'Sets a custom twitch message for a streamer',
                usage: 'twitchmessage [streamername] [message]',
                examples: ['twitchmesage notmiauu Now streaming here! {link}'],
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

        const streamers : {
            name: string, 
            message: string, 
            pings: string[], 
            posted: boolean
        }[] = this.client.settings.get(message.guild, 'twitch.twitch-streamers', {})

        if (!streamers.arrayEmpty()) {
            try {
                streamers.find(sid => sid.name === streamer).message = streamMessage
                this.client.settings.set(message.guild, 'twitch.twitch-streamers', streamers)
                return message.channel.send('I have updated the stream message for this streamer!')
            } catch (err) {
                return message.channel.send('That streamer is not on the list!')
            }
        } else {
            return message.channel.send('You need to add streamers onto the list first.')
        }
    }
}