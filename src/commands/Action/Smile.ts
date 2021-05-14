import { Command } from 'discord-akairo'
import { Message, MessageEmbed } from 'discord.js'

import { _GetAnimeSFW } from '../../util/Functions'

export default class Smile extends Command {
    public constructor() {
        super('smile', {
            aliases: ['smile'],
            category: 'Action',
            description: {
                content: 'You seem pretty happy today!',
                usage: 'happy',
                examples: ['happy'],
            },
            ratelimit: 3
        })
    }

    public async exec(message: Message): Promise<Message> {        
        const smile = await _GetAnimeSFW('smile')
        
        return message.util!.send(new MessageEmbed()
            .setDescription(`Oh look, **${message.author.tag}** is smiling!`)
            .setColor('RANDOM')
            .setImage(smile.url)
        )
    }
}