import { Command, Listener } from 'discord-akairo'
import { Message } from 'discord.js'

export default class Cooldown extends Listener {
    public constructor() {
        super('cooldown', {
            emitter: 'commandHandler',
            event: 'cooldown',
            category: 'commandHandler'
        })
    }

    public exec(message: Message, command: Command, remaining: number) {
        return message.channel.send(`You're on a cooldown! You will have to wait for \`${(remaining / 1000).toFixed(0)}\`seconds to run this command again.`)
    }
}