import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

export default class Restart extends Command {
    public constructor() {
        super('restart', {
            aliases: ['restart', 'reload'],
            category: 'Owner',
            description: {
                    content: 'Restarts a command (or all commands & listeners)',
                    usage: ['restart [file] <type>'],
                    examples: ['restart ping', 'reload all', 'restart messagecreate event']
            },
            ownerOnly: true,
            ratelimit: 3,
            args: [
                {
                    id: 'file',
                    type: 'string',
                    match: 'phrase'
                },
                {
                    id: 'type',
                    type: (_: Message, str: string) => {
                        const arr = ['command', 'event', 'inhibitor', 'service']
                        return arr.some(s => str.caseCompare(s)) ? str.toLowerCase() : 'command' 
                    }, 
                    match: 'phrase',
                }
            ]
        })
    }

    public async exec(message: Message, {file, type}: {file: string, type: string}): Promise<Message> {
        if (!file) return message.channel.send('You must provide a command, event or inhibitor.')

        if (file === 'all') {
            this.client.commandHandler.reloadAll()
            this.client.inhibitorHandler.reloadAll()
            this.client.listenerHandler.reloadAll()
            this.client.serviceHandler.reloadAll()
            return message.reply('All commands, inhibitors & listeners have been restarted.')
        } else {
            const fileServices = this.client.serviceHandler.modules.getArr('findfile', 'extractevent')

            try {
                const loc = await fileServices[0].exec(file, type)

                if (typeof loc === 'string' && loc.includes('/')) {
                    if (type === 'command') this.client.commandHandler.reload(file)
                    else if (type === 'event') this.client.listenerHandler.reload(fileServices[1].exec(loc))
                    else if (type === 'inhibitor') this.client.inhibitorHandler.reload(file)
                    else if (type === 'service') this.client.serviceHandler.reload(file)

                    return message.channel.send(`Restarted \`${file.toLowerCase()}\` successfully`)
                }
                else throw new Error(loc)
            } catch (err) {
                return message.channel.send(`There was an error querying for this command.\nMessage: ${err?.message}`)
            }
        }
    }
}