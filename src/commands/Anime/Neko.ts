import { Command } from 'discord-akairo'
import { Message, MessageEmbed } from 'discord.js'

import { _GetAnimeSFW } from '../../util/Functions'

export default class Neko extends Command {
    public constructor() {
        super('neko', {
            aliases: ['neko', 'nekos'],
            category: 'Anime',
            description: {
                content: 'Generates a random image of a neko.',
                usage: 'neko',
                examples: ['neko'],
            },
            ratelimit: 3,
        })
    }

    public async exec(message: Message): Promise<Message> {
        const neko = await _GetAnimeSFW('neko')

        return message.util!.send(new MessageEmbed()
            .setDescription('Here\'s a random image of a neko!')
            .setColor('RANDOM')
            .setImage(neko.url)
        )
    }
}