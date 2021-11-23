import { Command } from 'discord-akairo'
import { GuildMember, Message, MessageEmbed } from 'discord.js'

import { _GetAnimeSFW } from '../../util/functions/anime'

export default class Cringe extends Command {
    public constructor() {
        super('cringe', {
            aliases: ['cringe', 'cringes'],
            category: 'Action',
            description: {
                content: 'Cringes (possibly because of a user)',
                usage: 'cringe <@user>',
                examples: ['cringe', 'cringe @user'],
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
        const cringeGif = await _GetAnimeSFW('cringe')
        
        const e = new MessageEmbed()
            .setColor('RANDOM')
            .setImage(cringeGif.url)

        if (!member) {
            e.setDescription(`**${message.author.tag}** is cringing, oh man.`)
            return message.util.send({ embeds: [e] })
        }
        else if (member.user.id === message.author.id) {
            e.setDescription(`**${message.author.tag}** is cringing at themselves, oh dear.`)
            return message.util.send({ embeds: [e] })
        }
        else {
            e.setDescription(`**${message.author.tag}** is cringing because of **${member.user.tag}**.`)
            return message.util.send({ embeds: [e] })
        }
    }
}