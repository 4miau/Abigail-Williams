import { Command } from 'discord-akairo'
import { GuildMember, Message, MessageEmbed } from 'discord.js'

import { _GetAnimeSFW } from '../../util/functions/anime'

export default class Hug extends Command {
    public constructor() {
        super('hug', {
            aliases: ['hug', 'huggies'],
            category: 'Action',
            description: {
                content: 'Hugs a user',
                usage: 'hug [@user]',
                examples: ['hug @user'],
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
        if (!member) return message.util.send('Please provide a member to hug.')
        
        const hugGif = await _GetAnimeSFW('hug')

        const e = new MessageEmbed()
            .setColor('RANDOM')
            .setImage(hugGif.url)
        
        if (member.user.id === message.author.id) {
            e.setDescription(`**${member.user.tag}** has hugged themselves! (Must be lonely)`)
            return message.util.send({ embeds: [e] })
        }
        else {
            e.setDescription(`**${message.author.tag}** has hugged **${member.user.tag}!**`)
            return message.util.send({ embeds: [e] })
        }
    }
}