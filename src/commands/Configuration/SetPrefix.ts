import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

export default class Prefix extends Command {
    public constructor() {
        super('prefix', {
            aliases: ['prefix', 'setprefix'],
            category: 'Configuration',
            description: {
                    content: 'Gets/sets the server prefix',
                    usage: 'prefix <newPrefix>',
                    examples: ['prefix a.']
            },
            channel: 'guild',
            userPermissions: ['MANAGE_GUILD'],
            ratelimit: 3,
            args: [
                {
                    id: 'prefix',
                    type: 'string'
                }
            ]
        })
    }

    public async exec(message: Message, {prefix}: {prefix: string}): Promise<Message> {
        if (!prefix) {
            const currentPrefix = this.client.settings.get(message.guild, 'config.prefix', 'a.')
            return message.util!.send(`The server's current prefix is ${currentPrefix}`)
        }

        if (prefix.length < 10) {
            this.client.settings.set(message.guild, 'config.prefix', prefix)
            return message.util!.send(`I have set the new server prefix to ${prefix}`)
        }

        return message.util!.send('Please make your new prefix between 1-10 characters.')
    }
}