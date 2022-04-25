import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

export default class Build extends Command {
    public constructor() {
        super('build', {
            aliases: ['build', 'load'],
            category: 'Developer',
            description: {
                    content: 'Loads a file into the bot.',
                    usage: 'load [file] <type>',
                    examples: ['load 8ball', 'load messageCreate event']
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
        if (!file) return message.channel.send('You need to load a command, event or inhibitor.')

        const fileService = this.client.serviceHandler.modules.get('findfile')

        try {
            const location = await fileService.exec(file, type)

            if (typeof location === 'string' && location.includes('/')) {
                if (type === 'command') this.client.commandHandler.load(location)
                else if (type === 'event') this.client.listenerHandler.load(location)
                else if (type === 'inhibitor') this.client.inhibitorHandler.load(location)
                else if (type === 'service') this.client.serviceHandler.load(location)

                return message.channel.send(`Built \`${file.toLocaleLowerCase()}\` successfully`)
            }
            else throw new Error(location)
        } catch (err) {
            return message.channel.send(`There was an error querying for this command.\nMessage: ${err?.message}`)
        }
    }
}

