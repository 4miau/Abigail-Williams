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
            ratelimit: 3
        })
    }

    public async exec(message: Message): Promise<Message> {
        const quoteService = this.client.serviceHandler.modules.get('getanimequote')
        const quoteData: { anime: string, character: string, quote: string} = await quoteService.exec()

        const e = new MessageEmbed()
            .setDescription(`**Anime Quote | ${quoteData.anime}**\n${quoteData.quote}`)
            .setColor(Colours.IndianRed)
            .setFooter(`Character: ${quoteData.character}`)

        return message.channel.send({ embeds: [e] })
    }
}