import { Command } from 'discord-akairo'
import { Message, MessageEmbed } from 'discord.js'
import axios from 'axios'

import { Colours } from '../../util/Colours'

export default class AnimeQuote extends Command {
    public constructor() {
        super('animequote', {
            aliases: ['animequote', 'aquote'],
            category: '',
            description: {
                content: 'Returns an anime quote.',
                usage: 'animequote',
                examples: ['animequote'],
            },
            ratelimit: 3,
        })
    }

    public async exec(message: Message): Promise<Message> {
        const animeQuote = await axios.get('https://animechan.vercel.app/api/random', {
            'method': 'GET'
        })
        .then(res => res.data)

        return message.util!.send(new MessageEmbed()
            .setDescription(`
                **Anime Quote | ${animeQuote.anime}**
                ${animeQuote.quote}
            `)
            .setColor(Colours.IndianRed)
            .setFooter('Character: ' + animeQuote.character)
        )
    }
}