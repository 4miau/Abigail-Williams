import axios from 'axios'
import { Command } from 'discord-akairo'
import { Message, MessageEmbed } from 'discord.js'
import { SubaruGIFs, SubaruImgs } from '../../util/Constants'

export default class Duck extends Command {
    public constructor() {
        super('duck', {
            aliases: ['duck'],
            category: 'Images',
            description: {
                content: 'Pictures of ducks! (Very small random chance of getting a little surprise duck aswell 😉)',
                usage: 'duck <-gif>',
                examples: ['duck', 'duck -gif'],
            },
            channel: 'guild',
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
        let duck: string

        const random = Math.floor(Math.random() * 750)
        const subaru = 137

        if (subaru === random) {
            this.client.logger.log('INFO', `${message.author.id} has found the Subaru secret.`)

            const e = new MessageEmbed()
                .setDescription('Here\'s a wild image of... Subaru...?! You found the secret!')
                .setColor('RANDOM')

            if (gif) {
                const chosen = Math.floor(Math.random() * SubaruGIFs.length)
                e.setImage(SubaruGIFs[chosen])

                return message.channel.send({ embeds: [e] })
            }
            else {
                const chosen = Math.floor(Math.random() * SubaruImgs.length)
                e.setImage(SubaruImgs[chosen])

                return message.channel.send({ embeds: [e] })
            }
        }

        try {
            if (gif) duck = await axios.get('https://random-d.uk/api/v2/random?type=gif', {method: 'GET'}).then(res => res.data.url)
            else duck = await axios.get('https://random-d.uk/api/v2/random?type=jpg', { method: 'GET'}).then(res => res.data.url) 
        } catch {
            return message.channel.send('Failed to fetch image, please report via my `a.feedback` command, as the API is likely temporarily down.')
        }

        const e = new MessageEmbed()
            .setDescription('Oh looky, a random image of a duck!')
            .setColor('RANDOM')
            .setImage(duck || '`The API is currently down, please contact miau#0004 and try again later.`')

        return message.channel.send({ embeds: [e] })
    }
}