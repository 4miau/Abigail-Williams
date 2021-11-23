import { Command } from 'discord-akairo'
import { GuildMember, Message, MessageEmbed } from 'discord.js'

import { _GetAnimeSFW } from '../../util/functions/anime'

export default class Kiss extends Command {
    public constructor() {
        super('kiss', {
            aliases: ['kiss', 'kisses'],
            category: 'Action',
            description: {
                content: 'Kisses a user',
                usage: 'kiss [@user]',
                examples: ['kiss @user'],
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
        if (!member) return message.util.send('Provide a member to kiss.')
        if (member.user.id === message.author.id) return message.util.send('You can\'t kiss yourself!')
        
        const kissGif = await _GetAnimeSFW('kiss')

        const e = new MessageEmbed()
            .setDescription(`**${message.author.tag}** has kissed **${member.user.tag}!** Woah!`)
            .setColor('RANDOM')
            .setImage(kissGif.url)

        return message.util.send({ embeds: [e] })
    }
}