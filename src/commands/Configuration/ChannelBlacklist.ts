import { Command } from 'discord-akairo'
import { Message, TextChannel } from 'discord.js'

export default class ChannelBlacklist extends Command {
    public constructor() {
        super('channelblacklist', {
            aliases: ['channelblacklist', 'blacklistchannel', 'blockchannel'],
            category: 'Configuration',
            description: {
                    content: 'Blacklists commands from a channel',
                    usage: 'blacklist [#channel]',
                    examples: ['blacklist #lobby']
            },
            channel: 'guild',
            userPermissions: ['MANAGE_GUILD'],
            ratelimit: 3,
            args: [
                {
                    id: 'channel',
                    type: 'channel',
                }
            ]
        })
    }

    public async exec(message: Message, {channel}: {channel: TextChannel}): Promise<Message> {
        if (!channel) return message.util!.send('You must provide a channel to blacklist.')

        const blacklistedChannels: string[] = this.client.settings.get(message.guild, 'channel-blacklist', [])

        if (blacklistedChannels.includes(channel.id)) {
            return message.util!.send('The channel is already blacklisted from commands.')
        }

        blacklistedChannels.push(channel.id)
        this.client.settings.set(message.guild, 'channel-blacklist', blacklistedChannels)
        return message.util!.send('Channel has been blacklisted from commands.')


    }
} 