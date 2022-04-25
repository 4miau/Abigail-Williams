import { Command } from 'discord-akairo'
import { Message, MessageEmbed } from 'discord.js'

export default class Smug extends Command {
    public constructor() {
        super('smug', {
            aliases: ['smug'],
            category: 'Action',
            description: {
                content: 'Pull a smug face',
                usage: 'smug',
                examples: ['smug'],
            },
            ratelimit: 3
        })
    }

    public async exec(message: Message): Promise<Message> {
        const animeService = this.client.serviceHandler.modules.get('getanimesfw')
        const smug = await animeService.exec('smug')

        const e = new MessageEmbed()
            .setDescription(`**${message.author.tag}** pulls a smug face`)
            .setColor('RANDOM')
            .setImage(smug.url)
        
        return message.channel.send({ embeds: [e] })
    }
}