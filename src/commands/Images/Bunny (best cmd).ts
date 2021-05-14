import { Command } from 'discord-akairo'
import { Message, MessageEmbed } from 'discord.js'
import axios from 'axios'

export default class Bunny extends Command {
    public constructor() {
        super('bunny', {
            aliases: ['bunny', 'bunnies'],
            category: 'Images',
            description: {
                content: 'Posts an image of a bunny, best command to be honest.',
                usage: 'bunny',
                examples: ['bunny'],
            },
            ratelimit: 3,
        })
    }

    public async exec(message: Message): Promise<Message> {
        const bunny = await axios.get('https://api.bunnies.io/v2/loop/random/?media=gif,png', {
            'method': 'GET'
        })
        .then(res => res.data)
        
        return message.util!.send(new MessageEmbed()
            .setDescription('Here\'s a bunny! The best animal, totally not bias!')
            .setColor('RANDOM')
            .setImage(bunny.media.gif)
            .setFooter(`#${bunny.id}`)
        )
    }
}