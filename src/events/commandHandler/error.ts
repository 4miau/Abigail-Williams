import { Command, Listener } from 'discord-akairo'
import { Message } from 'discord.js'

export default class error extends Listener {
    public constructor() {
        super('error', {
            emitter: 'commandHandler',
            event: 'error',
            category: 'commandHandler'
        })
    }

    public exec(err: Error, message: Message, command: Command) {
        this.client.logger.log('ERROR', `Error running ${command?.id}.\nError Message:\n${err.stack}`)
        message.channel.send('There was an error running this command, please report this to `miau#0004`.')
    }
}