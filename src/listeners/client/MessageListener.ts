import { Listener } from 'discord-akairo'
import { Message } from 'discord.js'

export default class MessageListener extends Listener {
    public constructor() {
        super('message', {
            emitter: 'client',
            event: 'message',
            category: 'client',
        })
    }

    public async exec(message: Message): Promise<void> {
        if (message.content === 'startthread') return
    }
}

//Channel Blacklist
//User Blacklist
//Modmail blacklist (in future)