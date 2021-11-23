import { Command } from 'discord-akairo'
import { Message, MessageEmbed } from 'discord.js'

import { _GetAnimeSFW } from '../../util/functions/anime'

export default class Smug extends Command {
    public constructor() {
        super('smug', {
            aliases: ['smug'],
            category: 'Action',
            description: {
                content: 'Pull a smug face',
                usage: 'smug',
                examples: ['smug'],
            },
            ratelimit: 3
        })
    }

    public async exec(message: Message): Promise<Message> {        
        const smug = await _GetAnimeSFW('smug')

        const e = new MessageEmbed()
            .setDescription(`**${message.author.tag}** pulls a smug face`)
            .setColor('RANDOM')
            .setImage(smug.url)
        
        return message.util.send({ embeds: [e] })
    }
}