import { Command } from 'discord-akairo'
import { Message, Channel } from 'discord.js'

export default class ChannelWhitelist extends Command {
    public constructor() {
        super('channelwhitelist', {
            aliases: ['channelwhitelist', 'whitelistchannel', 'addchannel'],
            category: 'Configuration',
            description: {
                    content: 'Whitelists a blacklisted channel',
                    usage: 'channelwhitelist [#blacklistedChannel]',
                    examples: ['channelwhitelist #blacklistedChannel']
            },
            userPermissions: ['MANAGE_GUILD', 'MANAGE_CHANNELS'],
            ratelimit: 3,
            args: [
                {
                    id: 'channel',
                    type: 'channel'
                }
            ]
        })
    }

    public exec(message: Message, {channel}: {channel: Channel}): Promise<Message> {
        if (!channel) return message.util!.send('You must provide a valid channel to whitelist.')

        let whitelistedChannels: string[] = this.client.settings.get(message.guild, 'channel-blacklist', [])
        
        if (whitelistedChannels.includes(channel.id)) {
            whitelistedChannels = whitelistedChannels.filter(bc => bc !== channel.id)
            this.client.settings.set(message.guild, 'channel-blacklist', whitelistedChannels)
            return message.util!.send('Channel has been removed from the whitelist.')
        }

        return message.util!.send('Channel is not blacklisted.')
    }
}