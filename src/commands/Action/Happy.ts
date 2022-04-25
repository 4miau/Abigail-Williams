import { Command } from 'discord-akairo'
import { Message, MessageEmbed } from 'discord.js'

export default class Happy extends Command {
    public constructor() {
        super('happy', {
            aliases: ['happy'],
            category: 'Action',
            description: {
                content: 'You are definitely happy!',
                usage: 'happy',
                examples: ['happy'],
            },
            ratelimit: 3
        })
    }

    public async exec(message: Message): Promise<Message> {
        const animeService = this.client.serviceHandler.modules.get('getanimesfw')
        const happy = await animeService.exec('happy')

        const e = new MessageEmbed()
            .setDescription(`**${message.author.tag}** is happy today!`)
            .setColor('RANDOM')
            .setImage(happy.url)
        
        return message.channel.send({ embeds: [e] })
    }
}