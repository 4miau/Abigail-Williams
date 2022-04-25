import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

export default class Dismantle extends Command {
    public constructor() {
        super('dismantle', {
            aliases: ['dismantle', 'unbuild'],
            category: 'Developer',
            description: {
                content: 'Dismantles and unloads a file loaded on the bot.',
                usage: 'dismantle [file] <type>',
                examples: ['dismantle 8ball', 'dismantle messageCreate event'],
            },
            ownerOnly: true,
            ratelimit: 3,
            args: [
                {
                    id: 'file',
                    type: 'string',
                    match: 'phrase',
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
        if (!file) return message.channel.send('You need to dismantle a command, event or inhibitor.')

        const fileService = this.client.serviceHandler.modules.get('findfile')

        try {
            const location = await fileService.exec(file, type)

            if (typeof location === 'string' && location.includes('/')) {
                if (type === 'command') this.client.commandHandler.remove(file)
                else if (type === 'event') this.client.listenerHandler.remove(file)
                else this.client.inhibitorHandler.remove(file)

                return message.channel.send(`Dismantled ${file.capitalize()} successfully.`)
            }
            else throw new Error(location)
        } catch (err) {
            return message.channel.send(`There was an error querying for this command.\nMessage: ${err?.message}`)
        }
    }
}