import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

export default class Shutdown extends Command {
    public constructor() {
        super('shutdown', {
            aliases: ['shutdown'],
            category: 'Owner',
            description: [
                {
                    content: 'Shutsdown the bot, allowing restarting of the bot.',
                    usage: 'shutdown',
                    examples: 'shutdown'
                }
            ],
            ownerOnly: true,
            ratelimit: 3
        })
    }

    public exec(message: Message) {
        this.client.destroy()
    }
}