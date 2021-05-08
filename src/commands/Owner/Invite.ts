import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

export default class Invite extends Command {
    public constructor() {
        super('invite', {
            aliases: ['invite', 'getinvite'],
            category: 'Owner',
            description: {
                    content: 'Get a link to invite me!',
                    usage: 'getinvite',
                    examples: ['getinvite']
            },
            ownerOnly: true,
            ratelimit: 3
        })
    }

    public exec(message: Message): Promise<Message> {
        return message.util!.send('https://discord.com/oauth2/authorize?client_id=600845569019346954&permissions=8&scope=bot')
    }
}