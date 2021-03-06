import { Command } from 'discord-akairo'
import { Message, TextChannel } from 'discord.js'

export default class FeedChannel extends Command {
    public constructor() {
        super('feedchannel', {
            aliases: ['feedchannel', 'twitchfeedchannel'],
            category: 'Twitch',
            description: {
                content: 'Manages the channel where messages are posted',
                usage: 'feedchannel [channel]',
                examples: ['feedchannel #announcements']
            },
            channel: 'guild',
            ratelimit: 3,
            args: [
                {
                    id: 'channel',
                    type: 'textChannel'
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

    public exec(message: Message, {channel}: {channel: TextChannel}): Promise<Message> {
        if (!channel) return message.channel.send('Please provide a channel to subscribe to')

        this.client.settings.set(message.guild, 'feed-channel', channel.id)
        return message.channel.send(`#${channel.name} is the channel that I will now be announcing streams in!`)
    }
}