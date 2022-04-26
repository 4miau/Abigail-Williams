import { Command } from 'discord-akairo'
import { Guild, Message } from 'discord.js'

export default class SetDBKey extends Command {
    public constructor() {
        super('setdbkey', {
            aliases: ['setdbkey'],
            category: 'Developer',
            description: {
                content: 'Sets an entire database key or a server\'s database key.',
                usage: 'setdbkey [key] <guild>',
                examples: ['setdbkey'],
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
                    id: 'newValue',
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

    public async exec(message: Message, {key, newValue, server}: {key: string, newValue: string, server: Guild}): Promise<Message> {
        if (!server) {
            this.client.guilds.cache.forEach(async guild => {
                await this.client.settings.set(guild, key, newValue)
            })
            this.client.logger.log('INFO', 'Set the new value for this key for all servers.')
            return message.channel.send('Set the new value for the key for all servers.')
        } else {
            await this.client.guilds.fetch(server.id).then(g => {
                this.client.logger.log('INFO', `Cleared key from ${g.name}`)
                this.client.settings.set(g, key, newValue)
            })
            return message.channel.send('Set the new value for this key from database for the server.')
        }
    }
}

//TODO: Add validation