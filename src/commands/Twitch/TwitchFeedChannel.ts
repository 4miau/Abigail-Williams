import { Command } from 'discord-akairo'
import { Message, TextChannel } from 'discord.js'

export default class TwitchFeedChannel extends Command {
    public constructor() {
        super('twitchfeedchannel', {
            aliases: ['twitchfeedchannel', 'twitchsubchannel'],
            category: 'Twitch',
            description: {
                content: 'Manages the channel where messages are posted',
                usage: 'twitchsubchannel [#channel]',
                examples: ['twitchsubchannel #announcements']
            },
            ownerOnly: true,
            userPermissions: ['MANAGE_CHANNELS'],
            ratelimit: 3,
            args: [
                {
                    id: 'channel',
                    type: 'channel'
                }
            ]
        })
    }

    public exec(message: Message, {channel}: {channel: TextChannel}): Promise<Message> {
        if (!channel) return message.util!.send('Please provide a channel to subscribe to')

        this.client.settings.set(message.guild, 'twitch.twitch-feedchannel', channel.id)
        return message.util!.send(`#${channel.name} is the channel that I will now be announcing streams in!`)
    }
}