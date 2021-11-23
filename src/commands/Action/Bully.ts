import { Command } from 'discord-akairo'
import { GuildMember, Message, MessageEmbed } from 'discord.js'

import { _GetAnimeSFW } from '../../util/functions/anime'

export default class Bully extends Command {
    public constructor() {
        super('bully', {
            aliases: ['bully', 'bullies'],
            category: 'Action',
            description: {
                content: 'Bullies a user',
                usage: 'bully [@user]',
                examples: ['bully @user'],
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
        if (!member) return message.util.send('Provide a member to bully!')
        if (member.user.id === message.author.id) return message.util.send('You can\'t bully yourself... that\'s just weird.')
        
        const bullyGif = await _GetAnimeSFW('bully')

        const e = new MessageEmbed()
            .setDescription(`**${message.author.tag}** is bullying **${member.user.tag}!**`)
            .setColor('RANDOM')
            .setImage(bullyGif.url)

        return message.util.send({ embeds: [e] })
    }
}