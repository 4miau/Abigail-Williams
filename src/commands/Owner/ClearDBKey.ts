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
                    id: 'key',
                    type: 'string',
                    match: 'phrase',
                },
                {
                    id: 'server',
                    type: 'guild',
                    match: 'phrase',
                },
            ]
        })
    }

    public async exec(message: Message, {key, server}: {key: string, server: Guild}): Promise<Message> {
        if (!server) {
            this.client.guilds.cache.forEach(async guild => {
                await this.client.settings.delete(guild, key)
            })
            this.client.logger.log('INFO', 'Cleared key from all servers.')
            return message.channel.send('Cleared key from all servers.')
        } else {
            await this.client.guilds.fetch(server.id).then(g => {
                this.client.logger.log('INFO', `Cleared key from ${g.name}`)
                this.client.settings.delete(g, key)
            })
            return message.channel.send('Cleared the key from database for the server.')
        }        
    }
}