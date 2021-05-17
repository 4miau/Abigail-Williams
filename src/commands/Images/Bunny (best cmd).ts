import { Command } from 'discord-akairo'
import { Message, MessageEmbed } from 'discord.js'
import axios from 'axios'

export default class Bunny extends Command {
    public constructor() {
        super('bunny', {
            aliases: ['bunny', 'bunnies'],
            category: 'Images',
            description: {
                content: 'Posts an image of a bunny, best command to be honest. (add -gif for a gif instead of a png)',
                usage: 'bunny',
                examples: ['bunny', 'bunny -gif'],
                flags: ['-gif']
            },
            ratelimit: 3,
            args: [
                {
                    id: 'gif',
                    match: 'flag'
                }
            ]
        })
    }

    public async exec(message: Message, {gif}: {gif: boolean}): Promise<Message> {
        const bunny = await axios.get('https://api.bunnies.io/v2/loop/random/?media=gif,png', {
            'method': 'GET'
        })
        .then(res => res.data.media)

        if (gif) {
            return message.util!.send(new MessageEmbed()
                .setDescription('Here\'s a bunny! The best animal, totally not bias!')
                .setColor('RANDOM')
                .setImage(bunny.gif)
                .setFooter(`#${bunny.id}`)
            )
        } else {
            return message.util!.send(new MessageEmbed()
                .setDescription('Here\'s a bunny! The best animal, totally not bias!')
                .setColor('RANDOM')
                .setImage(bunny.poster)
                .setFooter(`#${bunny.id}`)
            )   
        }
        

    }
}