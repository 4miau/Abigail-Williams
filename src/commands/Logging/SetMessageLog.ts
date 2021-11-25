import { Command } from 'discord-akairo'
import { Message, TextChannel } from 'discord.js'

export default class SetMessageLog extends Command {
    public constructor() {
        super('setmessagelog', {
            aliases: ['setmessagelog', 'messagelog', 'messagelogchannel', 'msglogchannel'],
            category: 'Logging',
            description: {
                content: 'Posts message logs in a log channel.',
                usage: 'setmessagelogs <channel>',
                examples: ['setmessagelogs #messagelogchannel'],
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

    public async exec(message: Message, {channel}: {channel: TextChannel}): Promise<Message> {
        if (!channel) {
            this.client.settings.delete(message.guild, 'logs.message-logs')
            return message.channel.send('Successfully deleted the server\'s current message log channel, if any.')
        }

        this.client.settings.set(message.guild, 'logs.message-logs', channel.id)
        return message.util.send(`I will now post message logs in ${channel}.`)
    }
}