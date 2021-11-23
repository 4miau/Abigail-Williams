import { Command } from 'discord-akairo'
import { Message, MessageEmbed } from 'discord.js'

import { _GetAnimeSFW } from '../../util/functions/anime'

export default class Cry extends Command {
    public constructor() {
        super('cry', {
            aliases: ['cry'],
            category: 'Action',
            description: {
                content: 'You start... crying?',
                usage: 'cry',
                examples: ['cry'],
            },
            ratelimit: 3
        })
    }

    public async exec(message: Message): Promise<Message> {        
        const cry = await _GetAnimeSFW('cry')

        const e = new MessageEmbed()
            .setDescription(`Oh look, **${message.author.tag}** has started crying.`)
            .setColor('RANDOM')
            .setImage(cry.url)
        
        return message.util.send({ embeds: [e] })
    }
}