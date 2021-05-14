import { Command } from 'discord-akairo'
import { Message, MessageEmbed } from 'discord.js'
import axios, { AxiosResponse } from 'axios'

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
        })
    }

    public async exec(message: Message): Promise<Message> {
        let cat: AxiosResponse<any>

        console.log(message.content.includes('-gif'))

        if (message.content.includes('-gif')) {
            cat = await axios.get('https://cataas.com/cat/gif?json=true', {
                'method': 'GET'
            })
            .then(res => res.data.url)
        } else {
            cat = await axios.get('https://cataas.com/cat/cute?json=true', {
                'method': 'GET'
            })
            .then(res => res.data.url)
        }

        return message.util!.send(new MessageEmbed()
            .setDescription('Here\'s an image of a cat!')
            .setColor('RANDOM')
            .setImage('https://cataas.com' + cat)
        )
    }
}