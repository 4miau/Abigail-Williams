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
        const modRole: string = this.client.settings.get(message.guild, 'modRole', '')
        const hasStaffRole = message.member.hasPermission(['MANAGE_GUILD', 'MANAGE_CHANNELS'], { checkAdmin: true, checkOwner: true}) || message.member.roles.cache.has(modRole)

        if (!hasStaffRole) return 'Moderator'
        return null
    }

    public exec(message: Message, {channel}: {channel: Channel}): Promise<Message> {
        if (!channel) return message.util!.send('You must provide a valid channel to whitelist.')

        let whitelistedChannels: string[] = this.client.settings.get(message.guild, 'channel-blacklist', [])
        
        if (whitelistedChannels.includes(channel.id)) {
            this.client.settings.set(message.guild, 'channel-blacklist', whitelistedChannels.filter(bc => bc !== channel.id))
            return message.util!.send('Channel has been removed from the whitelist.')
        }

        return message.util!.send('Channel is not blacklisted.')
    }
}