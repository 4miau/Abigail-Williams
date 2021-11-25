import { Command } from 'discord-akairo'
import { Message, TextChannel } from 'discord.js'

export default class TwitchFeedChannel extends Command {
    public constructor() {
        super('twitchfeedchannel', {
            aliases: ['twitchfeedchannel', 'twitchsubchannel'],
            category: 'Twitch',
            description: {
                content: 'Manages the channel where messages are posted',
                usage: 'twitchsubchannel [channel]',
                examples: ['twitchsubchannel #announcements']
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

        this.client.settings.set(message.guild, 'twitch.twitch-feedchannel', channel.id)
        return message.channel.send(`#${channel.name} is the channel that I will now be announcing streams in!`)
    }
}