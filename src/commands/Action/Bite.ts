import { Command } from 'discord-akairo'
import { GuildMember, Message, MessageEmbed } from 'discord.js'

import { _GetAnimeSFW } from '../../util/Functions'

export default class Bite extends Command {
    public constructor() {
        super('bite', {
            aliases: ['bite', 'bites'],
            category: 'Action',
            description: {
                content: 'Bites a user',
                usage: 'bite [@user]',
                examples: ['bite @user'],
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
        if (!member) return message.util!.send('Provide a member to bite.')
        if (member.user.id === message.author.id) return message.util!.send('Biting yourself? Don\'t be so weird!')
        
        const biteGif = await _GetAnimeSFW('bite')

        return message.util!.send(new MessageEmbed()
            .setDescription(`**${message.author.tag}** bit **${member.user.tag}!** Ouch!`)
            .setColor('RANDOM')
            .setImage(biteGif.url)
        )
    }
}