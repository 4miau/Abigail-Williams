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
                usage: 'dog <-gif>',
                examples: ['dog', 'dog -gif'],
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
        let dog: string

        if (gif) {
            dog = await axios.get('https://api.thedogapi.com/v1/images/search?mime_types=gif&order=RANDOM&page=0&limit=1', {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': dogAPIkey
                },
                method: 'GET'
            })
            .then(res => res.data[0].url)
        }
        else {
            dog = await axios.get('https://api.thedogapi.com/v1/images/search?mime_types=jpg,png&order=RANDOM&page=0&limit=1', {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': dogAPIkey
                },
                method: 'GET'
            })
            .then(res => res.data[0].url)
        }

        
        return message.util!.send(new MessageEmbed()
            .setDescription('Here\'s an image of a dog!')
            .setColor('RANDOM')
            .setImage(dog)
        )
        
    }
}