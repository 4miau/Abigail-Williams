import { Command } from 'discord-akairo'
import { Message, TextChannel } from 'discord.js'

export default class MessageLogs extends Command {
    public constructor() {
        super('messagelogs', {
            aliases: ['deletedmessagelogs', 'messagelogs', 'messagelogchannel', 'msglogchannel'],
            category: 'Configuration',
            description: {
                content: 'Posts deleted message logs in a designated text channel.',
                usage: 'deletedmessagelogs [channel] <clear>',
                examples: ['messagelogs #messagelogchannel'],
            },
            userPermissions: ['MANAGE_GUILD', 'VIEW_AUDIT_LOG'],
            ratelimit: 3,
            args: [
                {
                    id: 'channel',
                    type: 'channel'
                },
                {
                    id: 'clear',
                    match: 'flag',
                    flag: 'clear'
                }
            ]
        })
    }

    public async exec(message: Message, {channel, clear}: {channel: TextChannel, clear: boolean}): Promise<Message> {
        message.delete()

        if (clear) {
            const currMessageLogChannel = this.client.settings.get(message.guild, 'config.message-log', '')

            if (currMessageLogChannel) {
                await this.client.settings.delete(message.guild, 'config.message-log')
                return message.util!.send('I have removed your current deleted message logs channel.')
            }

            return message.util!.send('Your server does not currently have a deleted messagelogs channel.')
        }
        if (!channel) return message.util!.send('Please provide a channel for me to post deleted logs in.')

        try {
            channel.send('I will now be posting deleted message logs in this channel.')
            this.client.settings.set(message.guild, 'config.message-log', channel.id)

        } catch (err) {
            return message.util!.send('I do not have permissions to type in this channel.')      
        }
    }
}