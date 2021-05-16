import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

import { modmailGuild } from '../../util/PersonalConstants'

export default class Leave extends Command {
    public constructor() {
        super('leave', {
            aliases: ['leave', 'ragequit'],
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
        if (!server || message.guild.id === modmailGuild) return message.util!.send('I can not leave this guild.')
        if (!server) await message.guild.leave()

        const guildResolved = this.client.util.resolveGuild(server, this.client.guilds.cache)
        if (guildResolved) return await guildResolved.leave()

        return message.util!.send('Unable to resolve the guild you are trying to leave, sorry.')
    }
}