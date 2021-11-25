import { Command } from 'discord-akairo'
import { Message } from 'discord.js'
import fs from 'fs'

import { findFile, extractEvent } from '../../util/functions/fileaccess'

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
                    type: (_: Message, str: string) => { return (str.caseCompare('command', 'event', 'inhibitor')) ? str.toLocaleLowerCase() : 'command' }, 
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
            return message.reply('All commands, inhibitors & listeners have been restarted.')
        } else {
            try {
                const loc = await findFile(file, type)

                if (typeof loc === 'string' && loc.includes('/')) {
                    if (type === 'command') this.client.commandHandler.reload(file)
                    else if (type === 'event') this.client.listenerHandler.reload(extractEvent(loc))
                    else if (type === 'inhibitor') this.client.inhibitorHandler.reload(file)

                    return message.channel.send(`Restarted \`${file.toLocaleLowerCase()}\` successfully`)
                }
                else throw new Error(loc)
            } catch (err) {
                return message.channel.send(`There was an error querying for this command.\nMessage: ${err?.message}`)
            }
        }
    }
}