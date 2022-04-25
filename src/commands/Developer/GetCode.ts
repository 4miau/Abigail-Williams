import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

export default class GetCode extends Command {
    public constructor() {
        super('getcode', {
            aliases: ['getcode'],
            category: 'Developer',
            description: {
                content: 'Retrieves the code for an entire file (only commands, listeners, inhibitors and services)',
                usage: 'getcode [moduleName] <handler>',
                examples: ['getcode prune', 'getcode test service'],
            },
            channel: 'guild',
            ratelimit: 3,
            ownerOnly: true,
            args: [
                {
                    id: 'moduleName',
                    type: 'string',
                    match: 'phrase'
                },
                {
                    id: 'handler',
                    type: 'string',
                    match: 'phrase'
                }
            ]
        })
    }

    public async exec(message: Message, {moduleName, handler}: {moduleName: string, handler: string}): Promise<Message> {
        return message.channel.send('hi')
    }
}