import { Command, Listener } from 'discord-akairo'
import { Message } from 'discord.js'

export default class MissingPermissions extends Listener {
    public constructor() {
        super('MissingPermissions', {
            emitter: 'commandHandler',
            event: 'missingPermissions',
            category: 'commandHandler'
        })
    }

    public exec(message: Message, command: Command, type: string, missing: any) {
        if (type === 'client') {
            this.client.logger.log('CAUTION', `Client permissions missing in ${message.guild.name} (${message.guild.id}): ${missing}`)
            return message.channel.send('I am missing permissions to be able to run this command...\n' +
                `Permissions missing:\n${typeof missing === 'object' ? (missing as string[]).join('\n') : missing }`
            )
        }

        if (this.client.isOwner(message.author.id)) {
            return message.util!.send(
                `You are missing the necessary permissions to run this command.\n` +
                `Permission missing: ${typeof missing === 'object' ? (missing as string[]).join('\n') : missing }`
            )
        }

        this.client.logger.log('CAUTION', `User: ${message.author.tag} (${message.author.id})\nCommand: ${command.id}\nmissing: ${missing}.`)
        return message.channel!.send('You are missing the necessary permissions to run this command.')
    }
}