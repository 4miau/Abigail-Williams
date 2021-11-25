import { Command } from 'discord-akairo'
import { Message, TextChannel } from 'discord.js'

export default class SetChannelLog extends Command {
    public constructor() {
        super('setchannellog', {
            aliases: ['setchannellog', 'channellogs', 'channellog'],
            category: 'Logging',
            description: {
                content: 'Sets a channel for where to post channel logs. (Leave blank to remove)',
                usage: 'setchannellog <channel>',
                examples: ['setchannellog', 'setchannellog #modlogs'],
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
        const hasStaffRole = message.member.permissions.has(['VIEW_AUDIT_LOG', 'MANAGE_GUILD'], true) || message.member.roles.cache.has(modRole)

        if (!hasStaffRole) return 'Moderator'
        return null
    }

    public exec(message: Message, {channel}: {channel: TextChannel}): Promise<Message> {
        if (!channel) {
            this.client.settings.delete(message.guild, 'logs.channel-logs')
            return message.util.send('Successfully deleted the server\'s current channel log channel, if any.')
        }

        this.client.settings.set(message.guild, 'logs.channel-logs', channel.id)
        return message.util.send(`I will now post channel logs in ${channel}.`)
    }
}