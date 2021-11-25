import { Command } from 'discord-akairo'
import { Message, MessageEmbed } from 'discord.js'
import { spawnSync } from 'child_process'
import moment from 'moment'

import { Colours } from '../../util/Colours'

export default class PM2 extends Command {
    public constructor() {
        super('pm2', {
            aliases: ['pm2'],
            category: 'Owner',
            description: {
                content: 'Allows you to use pm2 related commands',
                usage: 'pm2 [commands]',
                examples: ['pm2 logs', 'pm2 start 1'],
            },
            ratelimit: 3,
            args: [
                {
                    id: 'commands',
                    type: (msg: Message) => { return msg.util.parsed?.afterPrefix?.toLocaleLowerCase() },
                    match: 'text'
                }
            ]
        })
    }

    public async exec(message: Message, {commands}: {commands: string}): Promise<any> {
        if (commands.includes('logs')) commands.append('--nostream')
        if (commands.includes('delete') || commands.includes('kill')) commands.replaceAll('delete', 'list').replaceAll('kill', 'list')
        if (commands.includes('stop')) commands.replaceAll('stop', 'restart')

        const executed = spawnSync(commands, { shell: true, windowsHide: true, timeout: 5000, serialization: 'advanced', encoding: 'utf8' })

        if (executed.error || executed.stderr) this.client.logger.log('ERROR', executed.error || executed.stderr)

        const execOutput = executed.output.join('\n')

        const e = new MessageEmbed()
            .setColor(Colours.Spring)
            .setFooter(`Command ran by ${message.author.tag} 💚 - ${moment().format('YYYY/M/DD HH:mm:ss')}`)

        if (commands.includes('list') || commands.includes('status') || commands.includes('reset') || commands.includes('ls')) {
            e.setDescription('```console\n' + execOutput.split('\n').slice(commands.includes('reset') ? 3 : 2, -3).map(s => {
                const a = s.split('│').map(s => s.replace(/ +/g, ' ').slice(1, -1))
                return [
                    `ID: ${a[1]}`,
                    `🔹 Name: ${a[2]}`,
                    `🔹 Uptime: ${a[7]}`,
                    `🔹 Total Restarts: ${a[8]}`,
                    `🔹 Memory Usage: ${a[11]}`,
                ].join('\n')
            }).splice(2).join('\n\n') + '\n```')

            await message.react('👌')
            return message.channel.send({ embeds: [e] })
        }

        try {
            if (execOutput.length > 2048) {
                await message.react('👌')
                return message.channel.send({ 
                    content: 'A file containing the output.',
                    files: [
                        {
                            attachment: Buffer.from(execOutput), 
                            name: 'output.log' 
                        }
                    ]
                })
            }
            else {
                await message.react('👌')
                return message.channel.send(`\`\`\`console\n${execOutput}\n\`\`\``)
            }
        } catch (err) {
            await message.react('⛔')
            return message.channel.send({
                content: 'An error occured, an error file has been attached containing the error.',
                files: [
                    {
                        attachment: Buffer.from(execOutput),
                        name: 'error.log'
                    }
                ]
            })
        }
    }
}