import { Command } from 'discord-akairo'
import { GuildMember, Message, MessageEmbed } from 'discord.js'

import { _GetAnimeSFW } from '../../util/Functions'

export default class Bonk extends Command {
    public constructor() {
        super('bonk', {
            aliases: ['bonk', 'bonks'],
            category: 'Action',
            description: {
                content: 'Bonks a user',
                usage: 'bonk [@user]',
                examples: ['bonk @user'],
            },
            channel: 'guild',
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
        if (!member) return message.util!.send('Provide a member to bonk!')
        if (member.user.id === message.author.id) return message.util!.send('You really shouldn\'t bonk yourself.')
        
        const bonkGif = await _GetAnimeSFW('bonk')

        return message.util!.send(new MessageEmbed()
            .setDescription(`**${message.author.tag}** bonked **${member.user.tag}!**`)
            .setColor('RANDOM')
            .setImage(bonkGif.url)
        )
    }
}