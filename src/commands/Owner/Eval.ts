import { Command } from 'discord-akairo'
import { Message, MessageEmbed } from 'discord.js'
import { performance } from 'perf_hooks'
import * as ts from 'typescript'

export default class Eval extends Command {
    public constructor() {
        super('eval', {
            aliases: ['eval'],
            category: 'Owner',
            description: {
                    content: 'Evaluates and executes Javascript code.',
                    usage: 'eval <JS/TS code>',
                    examples: ['eval console.log(\'hi\')']
            },
            ownerOnly: true,
            ratelimit: 3,
            args: [
                {
                    id: 'instructions',
                    type: 'string',
                    match: 'content'
                }
            ]
        })
    }

    public async exec(message: Message): Promise<any> {
        const bannedEvalWords = [
            'this.client.token',
            'token',
            'spotifyclient',
            'host',
            'password'
        ]

        let evalCode = message.util.parsed.content

        if (bannedEvalWords.some(s => evalCode.toLowerCase().includes(s))) return message.channel.send('You\'re a little cheeky one, aren\'t ya, master..')

        if (evalCode.startsWith('```js')) evalCode = evalCode.substring(5, evalCode.length - 3)
        else if (evalCode.startsWith('```ts')) {
            evalCode = evalCode.substring(5, evalCode.length - 3)
            evalCode = ts.transpile(evalCode)
        }

        const e = new MessageEmbed()
            .setTitle('Processing JavaScript code...')
            .setColor('BLUE')

        const reply = await message.channel.send({ embeds: [e] })

        const start = performance.now()

        try {
            const output = eval(evalCode)
            const e = new MessageEmbed()
                .setTitle(`Completed in ${(performance.now() - start).toFixed(3)}ms`)
                .setColor('GREEN')
                .addField('Returns', `\`\`\`javascript\n${output}\`\`\``)

            reply.edit({ embeds: [e] })
        } catch (err) {
            const e = new MessageEmbed()
                .setTitle(`Error in ${(performance.now() - start).toFixed(3)}ms`)
                .setColor('RED')
                .addField('Error', `\`\`\`javascript\n${err}\`\`\``)

            reply.edit({ embeds: [e] })
        }
    }
}