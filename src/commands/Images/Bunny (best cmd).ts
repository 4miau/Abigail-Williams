import { Command } from 'discord-akairo'
import { Message, MessageEmbed } from 'discord.js'
import axios from 'axios'

export default class Bunny extends Command {
    public constructor() {
        super('bunny', {
            aliases: ['bunny', 'bunnies'],
            category: 'Images',
            description: {
                content: 'Posts an image of a bunny, best command to be honest. (add -gif for a gif instead of a png) (currently disabled due to api)',
                usage: 'bunny',
                examples: ['bunny', 'bunny -gif'],
                flags: ['-gif']
            },
            ratelimit: 3,
            args: [
                {
                    id: 'gif',
                    match: 'flag',
                    flag: '-gif'
                }
            ]
        })
    }

    public async exec(message: Message, {gif}: {gif: boolean}): Promise<Message> {
        const bunny = await axios.get('https://api.bunnies.io/v2/loop/random/?media=gif,png', { 'method': 'GET' }).then(res => res.data)

        const e = new MessageEmbed()
            .setDescription('Here\'s a bunny! The best animal, totally not bias!')
            .setColor('RANDOM')
            .setImage(gif ? bunny.media.gif : bunny.media.poster)
            .setFooter(`#${bunny.id}` || '`The API is currently down, please contact miau#0004 and try again later.`')

        return message.channel.send({ embeds: [e] })
    }
}