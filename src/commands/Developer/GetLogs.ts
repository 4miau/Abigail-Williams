import { Command } from 'discord-akairo'
import { Message } from 'discord.js'
import fs from 'fs'
import { join } from 'path'

export default class GetLogs extends Command {
    public constructor() {
        super('getlogs', {
            aliases: ['getlogs'],
            category: 'Owner',
            description: {
                content: 'Retrieves logs from the abby-log file',
                usage: 'getlogs <numLines>',
                examples: ['getlogs', 'getlogs 15'],
            },
            ownerOnly: true,
            ratelimit: 3,
            args: [
                {
                    id: 'lines',
                    type: 'number',
                    match: 'phrase',
                    default: 15
                }
            ]
        })
    }

    public async exec(message: Message, {lines}: {lines: number }): Promise<Message> {
        const logsDir = join(__dirname, '..', '..', 'abby-log')
        const logsFile = fs.readFileSync(logsDir, { encoding: 'utf-8' }).split('\n')

        logsFile.splice(0, logsFile.length - lines)
        return message.channel.send({
            files: [
                {
                    attachment: Buffer.from(logsFile.join('\n')),
                    name: 'abby-log.log'
                }
            ]
        })
    }
}