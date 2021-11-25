import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

export default class Reboot extends Command {
    public constructor() {
        super('reboot', {
            aliases: ['reboot'],
            category: 'Owner',
            description: {
                content: 'Shutsdown the bot, will reboot if using pm2 though.',
                usage: 'reboot',
                examples: ['reboot'],
            },
            ownerOnly: true,
            ratelimit: 3
        })
    }

    public async exec(message: Message) {
        await message.react('👌')

        this.client.commandHandler.removeAll()
        this.client.listenerHandler.removeAll()
        this.client.inhibitorHandler.removeAll()
        
        process.exit(1)
    }
}