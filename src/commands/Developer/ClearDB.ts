import { Command } from 'discord-akairo'
import { Guild, Message } from 'discord.js'

export default class ClearDB extends Command {
    public constructor() {
        super('cleardb', {
            aliases: ['cleardb', 'dbclear', 'emptydb'],
            category: 'Developer',
            description: {
                content: 'Clears the entire database or the database for a server.',
                usage: 'cleardb <guild>',
                examples: ['cleardb', 'cleardb bunny cartel'],
            },
            ownerOnly: true,
            ratelimit: 3,
            args: [
                {
                    id: 'server',
                    type: 'guild',
                    match: 'rest'
                }
            ]
        })
    }

    public async exec(message: Message, {server}: {server: Guild}): Promise<Message> {
        if (!server) {
            this.client.guilds.cache.forEach(async guild => {
                await this.client.settings.clear(guild)
            })
            return message.channel.send('Database cleared entirely.')
        } else {
            await this.client.guilds.fetch(server.id).then(g => this.client.settings.clear(g))
            return message.channel.send('Cleared the database for the server.')
        }        
    }
}