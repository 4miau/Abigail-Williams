import { Command } from 'discord-akairo'
import { GuildMember, Message, MessageEmbed } from 'discord.js'

import { _GetAnimeSFW } from '../../util/Functions'

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
        const cringeGif = await _GetAnimeSFW('cringe')

        if (!member) {
            return message.util!.send(new MessageEmbed()
                .setDescription(`**${message.author.tag}** is cringing, oh man.`)
                .setColor('RANDOM')
                .setImage(cringeGif.url)
            )
        }
        else if (member.user.id === message.author.id) {
            return message.util!.send(new MessageEmbed()
            .setDescription(`**${message.author.tag}** is cringing at themselves, oh dear.`)
            .setColor('RANDOM')
            .setImage(cringeGif.url)
            )
        }
        else {
            return message.util!.send(new MessageEmbed()
                .setDescription(`**${message.author.tag}** is cringing because of **${member.user.tag}**.`)
                .setColor('RANDOM')
                .setImage(cringeGif.url)
            )
        }
    }
}