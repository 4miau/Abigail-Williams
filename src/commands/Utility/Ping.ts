import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

export default class Ping extends Command {
    public constructor() {
        super('ping', {
            aliases: ['ping', 'hello'],
            category: 'Utility',
            description: {
                    content: 'Pong.',
                    usage: 'ping',
                    examples: ['ping']
            },
            ratelimit: 3
        })
    }

    public async exec(message: Message): Promise<Message> {
        const sent = await message.util!.send('Pong!')
        const timeDiff = <any>(sent.editedAt || sent.createdAt) - <any>(message.editedAt || message.createdAt)
        return message.util!.send([
            'Pong!',
            `🔂 **RTT**: ${timeDiff} ms`,
            `💟 **Heartbeat**: ${Math.round(this.client.ws.ping)} ms`
        ])
    }
}