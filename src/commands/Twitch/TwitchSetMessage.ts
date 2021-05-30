import { Command } from 'discord-akairo'
import { Message } from 'discord.js'
import { _GetUserByName } from '../../util/Functions'

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
        const hasStaffRole = message.member.hasPermission('ADMINISTRATOR', { checkAdmin: false, checkOwner: true})

        if (!hasStaffRole) return 'Server Administrator'
        return null
    }

    public async exec(message: Message, {streamer, streamMessage}: {streamer: string, streamMessage: string}): Promise<Message> {
        if (!streamer) return message.util!.send('Please provide a streamer to check for.')
        if (!streamMessage) return message.util!.send('You should provide a stream message.')

        const streamerIDs: { name: string, message: string, posted: boolean }[] = this.client.settings.get(message.guild, 'twitch.twitch-streamers', [])

        if (streamerIDs.length > 0) {
            try {
                streamerIDs.find(sid => sid.name === streamer).message = streamMessage
                this.client.settings.set(message.guild, 'twitch.twitch-streamers', streamerIDs)
                return message.util!.send('I have updated the stream message for this streamer!')
            } catch (err) {
                return message.util!.send('That streamer is not on the list!')
            }
        } else {
            return message.util!.send('You need to add streamers onto the list first.')
        }
    }
}