import { Command } from 'discord-akairo'
import { Message, MessageEmbed } from 'discord.js'

export default class Waifu extends Command {
    public constructor() {
        super('waifu', {
            aliases: ['waifu'],
            category: 'Anime',
            description: {
                content: 'Posts an image of a random waifu.',
                usage: 'waifu',
                examples: ['waifu'],
            },
            ratelimit: 3,
        })
    }

    public async exec(message: Message): Promise<Message> {
        const animeService = this.client.serviceHandler.modules.get('getanimesfw')
        const waifu = await animeService.exec('waifu')

        const e = new MessageEmbed()
            .setDescription('Here\'s a random image of a waifu!')
            .setColor('RANDOM')
            .setImage(waifu.url)

        return message.channel.send({ embeds: [e] })
    }
}