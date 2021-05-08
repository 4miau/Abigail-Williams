import { Listener } from 'discord-akairo'
import { Message } from 'discord.js'

export default class MessageListener extends Listener {
    public constructor() {
        super('messagelistener', {
            'event': 'message',
            'emitter': 'client',
            'type': 'client'
        })
    }

    public exec(message: Message) {
        if (message.author.id === this.client.ownerID && message.content === `<@!${this.client.user.id}> <3`) {
            message.channel.send('<3')
        }
    }
}