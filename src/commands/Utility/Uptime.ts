import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

export default class Uptime extends Command {
    public constructor() {
        super('uptime', {
            aliases: ['uptime'],
            category: 'Utility',
            description: [
                {
                    content: 'Returns the uptime of the bot',
                    usage: 'uptime',
                    examples: 'uptime'
                }
            ],
            ratelimit: 3
        })
    }

    public exec(message: Message): Promise<Message> {
        return message.util!.send(this.client.uptime)
    }
}