import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

export default class Restart extends Command {
    public constructor() {
        super('restart', {
            aliases: ['restart', 'reload'],
            category: 'Owner',
            description: [
                {
                    content: 'Restarts a command (or all commands & listeners)',
                    usage: ['restart [command]'],
                    examples: ['restart ping', 'reload all']
                }
            ],
            ownerOnly: true,
            ratelimit: 3,
            args: [
                {
                    id: 'command',
                    type: 'commandAlias',
                    match: 'rest',
                    default: (msg: Message) => msg.util.reply('Unable to find that command')
                }
            ]
        })
    }

    public exec(message: Message, {command}: {command: string}): Promise<Message> {
        if (command === 'all') {
            this.client.commandHandler.reloadAll()
            this.client.listenerHandler.reloadAll()
            return message.util!.reply('All commands & listeners have been restarted.')
        } else {
            try {
                this.client.commandHandler.reload(command)
                return message.util!.reply(`${command} has been restarted successfully.`)
            } catch (err) {
                return message.util!.reply('Unable to restart this command.')
            }
        }
    }
}