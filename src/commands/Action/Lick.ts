import { Command } from 'discord-akairo'
import { GuildMember, Message, MessageEmbed } from 'discord.js'

import { _GetAnimeSFW } from '../../util/functions/anime'

export default class Lick extends Command {
    public constructor() {
        super('lick', {
            aliases: ['lick', 'licks'],
            category: 'Action',
            description: {
                content: 'Licks a user?',
                usage: 'lick [@user]',
                examples: ['lick @user'],
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
        if (!member) return message.util.send('Provide a member to lick. Weirdo.')
        if (member.user.id === message.author.id) return message.util.send('You can\'t lick yourself... that\'s just weird..')
        
        const lickGif = await _GetAnimeSFW('lick')

        const e = new MessageEmbed()
            .setDescription(`**${message.author.tag}** is licking **${member.user.tag}!** Eh...`)
            .setColor('RANDOM')
            .setImage(lickGif.url)

        return message.util.send({ embeds: [e] })
    }
}