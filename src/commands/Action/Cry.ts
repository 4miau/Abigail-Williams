import { Command } from 'discord-akairo'
import { Message, MessageEmbed } from 'discord.js'

export default class Cry extends Command {
    public constructor() {
        super('cry', {
            aliases: ['cry', 'cri'],
            category: 'Action',
            description: {
                content: 'You start...crying?',
                usage: 'cry',
                examples: ['cry'],
            },
            ratelimit: 3
        })
    }

    public async exec(message: Message): Promise<Message> {        
        const animeService = this.client.serviceHandler.modules.get('getanimesfw')
        const cry = await animeService.exec('cry')

        const e = new MessageEmbed()
            .setDescription(`Oh look, **${message.author.tag}** has started crying.`)
            .setColor('RANDOM')
            .setImage(cry.url)
        
        return message.channel.send({ embeds: [e] })
    }
}