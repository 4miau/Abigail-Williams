import { Command } from 'discord-akairo'
import { GuildMember, Message, MessageEmbed } from 'discord.js'

import { _GetAnimeSFW } from '../../util/functions/anime'

export default class Blush extends Command {
    public constructor() {
        super('blush', {
            aliases: ['blush', 'blushes', 'blushy'],
            category: 'Action',
            description: {
                content: 'Blushes (possibly because of a user :flushed:)',
                usage: 'blush <@user>',
                examples: ['blush', 'blush @user'],
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
        const blushGif = await _GetAnimeSFW('blush')

        const e = new MessageEmbed()
            .setColor('RANDOM')
            .setImage(blushGif.url)

        if (!member || member.user.id === message.author.id) {
            e.setDescription(`**${message.author.tag}** is blushing!`)
            return message.util.send({ embeds: [e] })
        }
        else {
            e.setDescription(`**${message.author.tag}** is blushing because of **${member.user.tag}**!`)
            return message.util.send({ embeds: [e] })
        }
    }
}