import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

import { modmailGuild } from '../../util/Constants'

export default class Leave extends Command {
    public constructor() {
        super('leave', {
            aliases: ['leave-server', 'ragequit'],
            category: 'Owner',
            description: {
                    content: 'Leaves a server or the current server.',
                    usage: 'leave <guildID>',
                    examples: ['leave']
            },
            ownerOnly: true,
            ratelimit: 3,
            args: [
                {
                    id: 'server',
                    type: 'string',
                }
            ]
        })
    }

    public async exec(message: Message, {server}: {server: string}): Promise<any> {
        if (message.guild.id === modmailGuild) return message.channel.send('I can not leave this guild. Sorry but it is my home.')
        if (!server) await message.guild.leave()

        const guildResolved = this.client.util.resolveGuild(server, this.client.guilds.cache)
        if (guildResolved) return await guildResolved.leave()

        return message.channel.send('Unable to resolve the guild you are trying to leave, sorry.')
    }
}