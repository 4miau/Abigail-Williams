import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

export default class Ping extends Command {
    public constructor() {
        super('ping', {
            aliases: ['ping'],
            category: 'Utility',
            description: [
                {
                    content: 'Pong.',
                    usage: 'ping',
                    examples: 'ping'
                }
            ],
            ratelimit: 3
        })
    }

    public exec(message: Message): Promise<Message> {
        return message.util!.reply(`Pong! ${this.client.ws.ping}ms!`)
    }
}