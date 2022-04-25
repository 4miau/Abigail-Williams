import { Command } from 'discord-akairo'
import { Message, MessageEmbed } from 'discord.js'

export default class Dance extends Command {
    public constructor() {
        super('dance', {
            aliases: ['dance', 'dances'],
            category: 'Action',
            description: {
                content: 'Look at you go with those moves!',
                usage: 'dance',
                examples: ['dance'],
            },
            ratelimit: 3
        })
    }

    public async exec(message: Message): Promise<Message> {
        const animeService = this.client.serviceHandler.modules.get('getanimesfw')    
        const dance = await animeService.exec('dance')

        const e = new MessageEmbed()
            .setDescription(`**${message.author.tag}** is dancing. Look at them go!`)
            .setColor('RANDOM')
            .setImage(dance.url)
        
        return message.channel.send({ embeds: [e] })
    }
}