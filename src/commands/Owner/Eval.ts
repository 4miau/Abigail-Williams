import { Command } from 'discord-akairo'
import { Message, MessageEmbed } from 'discord.js'
import { performance } from 'perf_hooks'

export default class Eval extends Command {
    public constructor() {
        super('eval', {
            aliases: ['eval'],
            category: 'Owner',
            description: {
                    content: 'Evaluates and executes Javascript code.',
                    usage: 'eval <JS code>',
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

    public async exec(message: Message): Promise<void> {
        const reply = await message.util.send(new MessageEmbed()
            .setTitle('Processing JavaScript code...')
            .setColor('BLUE')
        )

        const start = performance.now()

        try {
            const output = eval(message.util.parsed.content)
            reply.edit(new MessageEmbed()
                .setTitle(`Completed in ${(performance.now() - start).toFixed(3)}ms`)
                .setColor('GREEN')
                .addField('Returns', `\`\`\`javascript\n${output}\`\`\``)
            )
        } catch (err) {
            reply.edit(new MessageEmbed()
                .setTitle(`Error in ${(performance.now() - start).toFixed(3)}ms`)
                .setColor('RED')
                .addField('Error', `\`\`\`javascript\n${err}\`\`\``)
            )
        }
    }
}