import { Command } from 'discord-akairo'
import { GuildMember, Message, MessageEmbed } from 'discord.js'

import { _GetAnimeSFW } from '../../util/Functions'

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
        if (!member) return message.util!.send('Please provide a member to hug.')
        
        const hugGif = await _GetAnimeSFW('hug')
        
        if (member.user.id === message.author.id) {
            return message.util!.send(new MessageEmbed()
                .setDescription(`**${member.user.tag}** has hugged themselves! (Must be lonely)`)
                .setColor('RANDOM')
                .setImage(hugGif.url)
            )
        } else {
            return message.util!.send(new MessageEmbed()
                .setDescription(`**${message.author.tag}** has hugged **${member.user.tag}!**`)
                .setColor('RANDOM')
                .setImage(hugGif.url)
            )
        }
    }
}