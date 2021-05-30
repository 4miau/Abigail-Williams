import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

export default class Say extends Command {
    public constructor() {
        super('say', {
            aliases: ['say'],
            category: 'Fun',
            description: {
                    content: 'The bot will say whatever you tell it to say',
                    usage: 'say [WhatToSay]',
                    examples: ['say hello!']
            },
            clientPermissions: ['SEND_MESSAGES'],
            ratelimit: 3,
            args: [
                {
                    id: 'words',
                    type: 'string',
                    match: 'rest'
                }
            ]
        })
    }
    
    public async exec(message: Message, {words}: {words: string}) {
        await message.util!.message.delete()
        return message.util!.send(words)
    }
}