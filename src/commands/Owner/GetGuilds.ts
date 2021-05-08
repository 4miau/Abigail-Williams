import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

export default class GetGuilds extends Command {
    public constructor() {
        super('getGuild', {
            aliases: ['getguilds', 'guilds', 'servers'],
            category: 'Owner',
            description: {
                    content: 'Gets the ID of the guilds I am in.',
                    usage: 'getguilds',
                    examples: ['getguilds']
            },
            ownerOnly: true,
            ratelimit: 3
        })
    }

    public exec(message: Message): Promise<Message> {
        return message.util!.send(`${this.client.guilds.cache.map(g => g.name + ' : ' + g.id + '\n').join('')}`)
    }
}