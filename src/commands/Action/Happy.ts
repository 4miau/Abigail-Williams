import { Command } from 'discord-akairo'
import { Message, MessageEmbed } from 'discord.js'

import { _GetAnimeSFW } from '../../util/Functions'

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
        const happy = await _GetAnimeSFW('happy')
        
        return message.util!.send(new MessageEmbed()
            .setDescription(`**${message.author.tag}** is happy today!`)
            .setColor('RANDOM')
            .setImage(happy.url)
        )

    }
}