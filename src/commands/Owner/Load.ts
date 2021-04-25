import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

export default class Load extends Command {
    public constructor() {
        super('load', {
            aliases: ['load'],
            category: 'Owner',
            description: [
                {
                    content: 'Loads a command in',
                    usage: ['load [command]'],
                    examples: ['load 8ball', 'load all']
                }
            ],
            ownerOnly: true,
            ratelimit: 3,
            args: [
                {
                    id: 'command',
                    type: 'commandAlias',
                    match: 'rest',
                    default: (msg: Message) => msg.util!.send('You must provide a command to load in.')
                }
            ]
        })
    }

    public exec(message: Message, {command}: {command: string}): Promise<Message> {
        if (command === 'all') {
            this.client.commandHandler.loadAll()
            return message.util!.reply('All commands have been loaded in.')
        } else {
            try {
                this.client.commandHandler.load(command)
                return message.util!.reply(`${command} has been loaded successfully.`)
            } catch (err) {
                return message.util!.reply('This command can not be loaded in.')
            }
        }
    }
}