import { Command } from 'discord-akairo'
import { Message, MessageEmbed } from 'discord.js'

import { _GetAnimeSFW } from '../../util/Functions'

export default class Waifu extends Command {
    public constructor() {
        super('Waifu', {
            aliases: ['waifu'],
            category: '',
            description: {
                content: 'Posts an image of a random waifu.',
                usage: 'waifu',
                examples: ['waifu'],
            },
            ratelimit: 3,
        })
    }

    public async exec(message: Message): Promise<Message> {
        const waifu = await _GetAnimeSFW('waifu')

        return message.util!.send(new MessageEmbed()
            .setDescription('Here\'s a random image of a waifu!')
            .setColor('RANDOM')
            .setImage(waifu.url)
        )
    }
}