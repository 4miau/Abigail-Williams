import { Command, Listener } from 'discord-akairo'
import { Message } from 'discord.js'

export default class CommandBlockedListener extends Listener {
    constructor() {
        super('commandBlocked', {
            emitter: 'commandHandler',
            event: 'commandBlocked',
        })
    }

    exec(message: Message, command: Command, reason: string) {
        reason === 'owner' ? reason = 'this is an owner only command' : reason

        console.log(`${message.author.username} was blocked from using ${command.id} because of ${reason}!\n` +
            `Guild?: ${message.guild ? `True, ${message.guild.name} (${message.guild.id})` : 'False'}`
        )

        message.util!.send(`You have been blocked from using ${command} because of ${reason}.`)
    }
}
