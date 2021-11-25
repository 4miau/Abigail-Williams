import { Command } from 'discord-akairo'
import { Message, MessageEmbed } from 'discord.js'
import axios from 'axios'

import { envs } from '../../client/Components'

export default class Cat extends Command {
    public constructor() {
        super('cat', {
            aliases: ['cat', 'kitty'],
            category: 'Images',
            description: {
                content: 'Posts an image of a cat. (-gif means 100% will be a gif)',
                usage: 'cat',
                examples: ['cat'],
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
        let cat: string

        try {
            if (gif) {
                cat = await axios.get('https://api.thecatapi.com/v1/images/search?mime_types=gif&order=RANDOM&page=0&limit=1', {
                    'headers': {
                        'Content-Type': 'application/json',
                        'x-api-key': envs.catAPIkey
                    },
                    'method': 'GET'
                })
                .then(res => res.data[0].url)
            } else {
                cat = await axios.get('hhttps://api.thecatapi.com/v1/images/search?mime_types=jpg,png&order=RANDOM&page=0&limit=1', {
                    'method': 'GET'
                })
                .then(res => res.data[0].url)
            }
        } catch {
            return message.channel.send('Failed to fetch image, please report via my `a.feedback` command, as the API is likely temporarily down.')
        }

        const e = new MessageEmbed()
            .setDescription('Here\'s an image of a cat!')
            .setColor('RANDOM')
            .setImage(cat || '`The API is currently down, please contact miau#0004 and try again later.`')

        return message.channel.send({ embeds: [e] })
    }
}