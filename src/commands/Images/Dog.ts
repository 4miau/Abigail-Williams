import { Command } from 'discord-akairo'
import { Message, MessageEmbed } from 'discord.js'
import axios from 'axios'

import { dogAPIkey } from '../../Config'

export default class Dog extends Command {
    public constructor() {
        super('dog', {
            aliases: ['dog', 'doggo', 'pup'],
            category: 'Images',
            description: {
                content: 'Posts an image of a dog. (-gif means 100% will be a gif)',
                usage: 'dog',
                examples: ['dog'],
                flags: ['-gif']
            },
            ratelimit: 3,
        })
    }

    public async exec(message: Message): Promise<Message> {
        let dog: string

        console.log(message.content.includes('-gif'))

        if (message.content.includes('-gif')) {
            dog = await axios.get('https://api.thedogapi.com/v1/images/search?mime_types=gif&order=RANDOM&page=0&limit=1', {
                'headers': {
                    'Content-Type': 'application/json',
                    'x-api-key': dogAPIkey
                },
                'method': 'GET'
            })
            .then(res => res.data.url)
        } else {
            dog = await axios.get('https://api.thedogapi.com/v1/images/search?mime_types=jpg,png&order=RANDOM&page=0&limit=1', {
                'headers': {
                    'Content-Type': 'application/json',
                    'x-api-key': dogAPIkey
                },
                'method': 'GET'
            })
            .then(res => res.data)
        }

        return message.util!.send(new MessageEmbed()
            .setDescription('Here\'s an image of a dog!')
            .setColor('RANDOM')
            .setImage(dog)
        )
    }
}