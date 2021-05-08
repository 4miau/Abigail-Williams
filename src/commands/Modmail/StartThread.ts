import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

export default class StartThread extends Command {
    public constructor() {
        super('startthread', {
            aliases: ['startthread', 'contact'],
            
            category: 'Modmail',
            description: {
                    content: 'Starts a new thread with support members',
                    usage: 'startthread <reason>',
                    examples: ['startthread issues with verifying']
            },
            channel: 'dm',
            ratelimit: 3,
            args: [
                {
                    id: 'reason',
                    type: 'string',
                    match: 'content'
                }
            ]
        })
    }

    public exec(message: Message, {reason}: {reason: string}): Promise<Message> {
        return message.util!.send('hi')
    }
}