import { Command } from 'discord-akairo'
import { Message, MessageEmbed } from 'discord.js'

export default class Smile extends Command {
    public constructor() {
        super('smile', {
            aliases: ['smile'],
            category: 'Action',
            description: {
                content: 'You seem pretty happy today!',
                usage: 'happy',
                examples: ['happy'],
            },
            ratelimit: 3
        })
    }

    public async exec(message: Message): Promise<Message> {  
        const animeService = this.client.serviceHandler.modules.get('getanimesfw')      
        const smile = await animeService.exec('smile')

        const e = new MessageEmbed()
            .setDescription(`Oh look, **${message.author.tag}** is smiling!`)
            .setColor('RANDOM')
            .setImage(smile.url)
        
        return message.channel.send({ embeds: [e] })
    }
}