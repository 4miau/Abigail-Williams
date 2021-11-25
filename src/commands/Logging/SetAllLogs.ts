import { Command } from 'discord-akairo'
import { Message, TextChannel } from 'discord.js'

export default class SetAllLogs extends Command {
    public constructor() {
        super('setalllogs', {
            aliases: ['setalllogs', 'alllogs', 'setlogs'],
            category: 'Logging',
            description: {
                content: 'Sets the channel for all logs at once. (Leave blank to remove all logs)',
                usage: 'setalllogs <channel>',
                examples: ['setlogs #logs', 'setlogs'],
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
        const hasStaffRole = message.member.permissions.has('MANAGE_GUILD', true) || message.member.roles.cache.has(modRole)

        if (!hasStaffRole) return 'Moderator'
        return null
    }

    public exec(message: Message, {channel}: {channel: TextChannel}): Promise<Message> {
        if (!channel) {
            this.client.settings.deleteArr(message.guild, [
                'logs.channel-logs', 'logs.guild-logs', 'logs.message-logs', 'logs.mod-logs', 'logs.role-logs', 'logs.user-logs'
            ])
            return message.util.send('Successfully deleted the server\'s current channel log channel, if any.')
        }

        this.client.settings.setArr(message.guild, [
            { key: 'logs.channel-logs', value: channel.id},
            { key: 'logs.guild-logs', value: channel.id},
            { key: 'logs.message-logs', value: channel.id},
            { key: 'logs.mod-logs', value: channel.id},
            { key: 'logs.role-logs', value: channel.id},
            { key: 'logs.user-logs', value: channel.id},
        ])
        return message.util.send(`I will now post all logs in ${channel}.`)
    }
}