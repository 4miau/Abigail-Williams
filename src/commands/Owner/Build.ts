import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

export default class Build extends Command {
    public constructor() {
        super('build', {
            aliases: ['build', 'load'],
            category: 'Owner',
            description: {
                    content: 'Loads a command in',
                    usage: 'load [command]',
                    examples: ['load 8ball', 'load all']
            },
            ownerOnly: true,
            ratelimit: 3,
            args: [
                {
                    id: 'command',
                    type: 'string',
                    match: 'rest',
                }
            ]
        })
    }

    public exec(message: Message, {command}: {command: string}): Promise<Message> {
        try {
            this.client.commandHandler.register(this.client.commandHandler.load(command, false))
            return message.util!.reply(`${command} has been built successfully.`)
        } catch (err) {
            return message.util!.reply('This command has already been loaded or I can not load it in.')
        }
    }
}