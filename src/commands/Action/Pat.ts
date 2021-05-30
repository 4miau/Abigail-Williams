import { Command } from 'discord-akairo'
import { GuildMember, Message, MessageEmbed } from 'discord.js'

import { _GetAnimeSFW } from '../../util/Functions'

export default class Pat extends Command {
    public constructor() {
        super('pat', {
            aliases: ['pat', 'pats'],
            category: 'Action',
            description: {
                content: 'Pats a user',
                usage: 'pat [@user]',
                examples: ['pat @user'],
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
        const patGif = await _GetAnimeSFW('pat')

        if (!member || member.user.id === message.author.id) return message.util!.send(new MessageEmbed()
            .setDescription(`**${message.author.tag}** has patted themselves!?`)
            .setColor('RANDOM')
            .setImage(patGif.url)
        )
        else return message.util!.send(new MessageEmbed()
            .setDescription(`**${message.author.tag}** has patted **${member.user.tag}!**`)
            .setColor('RANDOM')
            .setImage(patGif.url)
        )
    }
}