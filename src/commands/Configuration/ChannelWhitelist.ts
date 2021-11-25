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
        const hasStaffRole = message.member.permissions.has(['MANAGE_GUILD', 'MANAGE_CHANNELS'], true) || message.member.roles.cache.has(modRole)

        if (!hasStaffRole) return 'Moderator'
        return null
    }

    public exec(message: Message, {channel}: {channel: Channel}): Promise<Message> {
        if (!channel) return message.channel.send('You must provide a valid channel to whitelist.')
        
        const blacklistedChannels: string[] = this.client.settings.get(message.guild, 'channel-blacklist', [])

        if (blacklistedChannels?.includes(channel.id)) {
            this.client.settings.set(message.guild, 'blacklisted-channels', blacklistedChannels.filter(c => c !== channel.toString()))
            return message.channel.send('Channel has been removed from the whitelist.')
        }
        else return message.channel.send('Channel is not blacklisted.')
    }
}