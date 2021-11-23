import { Command } from 'discord-akairo'
import { GuildMember, Message, MessageEmbed } from 'discord.js'

import { _GetAnimeSFW } from '../../util/functions/anime'

export default class Slap extends Command {
    public constructor() {
        super('slap', {
            aliases: ['slap', 'smack', 'educate'],
            category: 'Action',
            description: {
                content: 'Slaps a user',
                usage: 'slap [@user]',
                examples: ['slap @user'],
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
        if (!member) return message.util.send('Please provide a member to slap')
        if (member.user.id === message.author.id) return message.util!.send('Trying to slap yourself... are you some kind of sadist?')
        
        const slapGif = await _GetAnimeSFW('slap')

        const e = new MessageEmbed()
            .setDescription(`**${message.author.tag}** has slapped **${member.user.tag}!** Ouch!`)
            .setColor('RANDOM')
            .setImage(slapGif.url)

        return message.util.send({ embeds: [e] })
    }
}