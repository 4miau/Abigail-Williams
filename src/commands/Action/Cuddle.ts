import { Command } from 'discord-akairo'
import { GuildMember, Message, MessageEmbed } from 'discord.js'

import { _GetAnimeSFW } from '../../util/Functions'

export default class Cuddle extends Command {
    public constructor() {
        super('cuddle', {
            aliases: ['cuddle', 'cuddles', 'cuddling'],
            category: 'Action',
            description: {
                content: 'Cuddles a user',
                usage: 'cuddle [@user]',
                examples: ['cuddle @user'],
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
        if (!member) return message.util!.send('Provide a member to cuddle.')
        if (member.user.id === message.author.id) return message.util!.send('You can\'t cuddle yourself! Don\'t be so lonely!')
        
        const cuddleGif = await _GetAnimeSFW('cuddle')
        
        return message.util!.send(new MessageEmbed()
            .setDescription(`**${message.author.tag}** has hugged **${member.user.tag}!**`)
            .setColor('RANDOM')
            .setImage(cuddleGif.url)
        )

    }
}