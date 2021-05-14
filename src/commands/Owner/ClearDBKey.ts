import { Command } from 'discord-akairo'
import { Guild, Message } from 'discord.js'

export default class ClearDBKey extends Command {
    public constructor() {
        super('cleardbkey', {
            aliases: ['cleardbkey'],
            category: 'Owner',
            description: {
                content: 'Clears an entire database key or a server\'s database key.',
                usage: 'cleardbkey',
                examples: ['cleardbkey'],
            },
            ownerOnly: true,
            ratelimit: 3,
            args: [
                {
                    id: 'server',
                    type: 'guild',
                    match: 'phrase',
                    unordered: true
                },
                {
                    id: 'key',
                    type: 'string',
                    match: 'rest',
                    unordered: true
                }
            ]
        })
    }

    public async exec(message: Message, {server, key}: {server: Guild, key: string}): Promise<Message> {
        if (!server) {
            this.client.guilds.cache.forEach(async guild => {
                await this.client.settings.delete(guild, key)
            })
            this.client.logger.log('DEBUG', 'Cleared key from all servers.')
            return message.util!.send('Cleared key from all servers.')
        } else {
            await this.client.guilds.fetch(server.id).then(g => {
                this.client.logger.log('DEBUG', `Cleared key from ${g.name}`)
                this.client.settings.delete(g, key)
            })
            return message.util!.send(`Cleared the key from database for the server.`)
        }        
    }
}