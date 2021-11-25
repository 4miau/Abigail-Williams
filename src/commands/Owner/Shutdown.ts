import { Command } from 'discord-akairo'

export default class Shutdown extends Command {
    public constructor() {
        super('shutdown', {
            aliases: ['shutdown'],
            category: 'Owner',
            description: {
                    content: 'Shutsdown the bot, allowing restarting of the bot.',
                    usage: 'shutdown',
                    examples: ['shutdown']
            },
            ownerOnly: true,
            ratelimit: 3
        })
    }

    public exec() {
        this.client.logger.log('INFO', 'Bot shutdown successfully.')
        this.client.destroy()
    }
}