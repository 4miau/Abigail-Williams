import { Command } from 'discord-akairo'
import { Message, TextChannel } from 'discord.js'

export default class SetGuildLog extends Command {
    public constructor() {
        super('setguildlog', {
            aliases: ['setguildlog', 'guildlogs', 'guildlog'],
            category: 'Logging',
            description: {
                content: 'Set the channel for guild logs to be posted in. (Leave blank to remove)',
                usage: 'setguildlog <channel>',
                examples: ['setguildlog #modlogs'],
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
            this.client.settings.delete(message.guild, 'logs.guild-logs')
            return message.util.send('Successfully deleted the server\'s current guild log channel, if any.')
        }

        this.client.settings.set(message.guild, 'logs.guild-logs', channel.id)
        return message.util.send(`I will now post guild logs in ${channel}.`)
    }
}