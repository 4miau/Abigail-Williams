import { Command } from 'discord-akairo'
import { GuildMember, Message, MessageEmbed } from 'discord.js'

import { _GetAnimeSFW } from '../../util/functions/anime'

export default class Wave extends Command {
    public constructor() {
        super('wave', {
            aliases: ['wave', 'waves'],
            category: 'Action',
            description: {
                content: 'Waves (possibly at someone)',
                usage: 'wave <@user>',
                examples: ['wave', 'wave @user'],
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
        const waveGif = await _GetAnimeSFW('wave')

        const e = new MessageEmbed()
            .setColor('RANDOM')
            .setImage(waveGif.url)

        if (!member || member.user.id === message.author.id) {
            e.setDescription(`**${message.author.tag}** is waving!`)
            return message.util.send({ embeds: [e] })
        }
        else {
            e.setDescription(`**${message.author.tag}** is waving at **${member.user.tag}**!`)
            return message.util.send({ embeds: [e] })
        }
    }
}