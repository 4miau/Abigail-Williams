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
            ratelimit: 3,
            args: [
                {
                    id: 'channel',
                    type: 'textChannel',
                }
            ]
        })
    }

    //@ts-ignore
    userPermissions(message: Message) {
        const modRole = this.client.settings.get(message.guild, 'modRole', '')
        const hasStaffRole = message.member.permissions.has('MANAGE_GUILD', true) || message.member.roles.cache.has(modRole)

        if (!hasStaffRole) return 'Moderator'
        return null
    }

    public async exec(message: Message, {channel}: {channel: TextChannel}): Promise<Message> {
        if (!channel) return message.channel.send('You must provide a channel to blacklist.')

        const blacklistedChannels: string[] = this.client.settings.get(message.guild, 'channel-blacklist', [])

        if (blacklistedChannels?.includes(channel.id)) return message.channel.send('The channel is already blacklisted from commands.')
        else {
            blacklistedChannels.push(channel.toString())
            this.client.settings.set(message.guild, 'channel-blacklist', blacklistedChannels)
            return message.channel.send('Channel has been blacklisted from commands.')
        }
    }
} 