import { Command } from 'discord-akairo'
import { GuildMember, Message, MessageEmbed } from 'discord.js'

import { _GetAnimeSFW } from '../../util/Functions'

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
        const blushGif = await _GetAnimeSFW('blush')

        if (!member || member.user.id === message.author.id) {
            return message.util!.send(new MessageEmbed()
                .setDescription(`**${message.author.tag}** is blushing!`)
                .setColor('RANDOM')
                .setImage(blushGif.url)
            )
        }
        else {
            return message.util!.send(new MessageEmbed()
                .setDescription(`**${message.author.tag}** is blushing because of **${member.user.tag}**!`)
                .setColor('RANDOM')
                .setImage(blushGif.url)
            )
        }
    }
}