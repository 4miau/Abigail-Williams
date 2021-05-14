import { Command } from 'discord-akairo'
import { GuildMember, Message, MessageEmbed } from 'discord.js'

import { _GetAnimeSFW } from '../../util/Functions'

export default class HighFive extends Command {
    public constructor() {
        super('highfive', {
            aliases: ['highfive', 'highfives', 'high five', 'high fives'],
            category: 'Action',
            description: {
                content: 'Highfives a user.',
                usage: 'highfive [@user]',
                examples: ['highfive @user'],
            },
            ratelimit: 3,
            args: [
                {
                    id: 'member',
                    type: 'member'
                }
            ]
        })
    }

    public async exec(message: Message, {member}: {member: GuildMember}): Promise<Message> {
        if (!member) return message.util!.send('Provide a member to highfive!')
        if (member.user.id === message.author.id) return message.util!.send('Highfiving yourself... are you really that lonely?')
        
        const highFiveGif = await _GetAnimeSFW('highfive')

        return message.util!.send(new MessageEmbed()
            .setDescription(`**${message.author.tag}** has highfived **${member.user.tag}!**`)
            .setColor('RANDOM')
            .setImage(highFiveGif.url)
        )
    }
}