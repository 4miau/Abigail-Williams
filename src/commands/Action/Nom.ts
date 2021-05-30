import { Command } from 'discord-akairo'
import { GuildMember, Message, MessageEmbed } from 'discord.js'

import { _GetAnimeSFW } from '../../util/Functions'

export default class Nom extends Command {
    public constructor() {
        super('nom', {
            aliases: ['nom', 'noms'],
            category: 'Action',
            description: {
                content: 'Noms a user... is it tast- nevermind...',
                usage: 'nom [@user]',
                examples: ['nom @user'],
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
        if (member && member.user.id === message.author.id) return message.util!.send('You really shouldn\'t nom yourself...')
        
        const nomGif = await _GetAnimeSFW('nom')

        if (!member) {
            return message.util!.send(new MessageEmbed()
                .setDescription(`**${message.author.tag}** is nomming!`)
                .setColor('RANDOM')
                .setImage(nomGif.url)
            )
        }
        else {
            return message.util!.send(new MessageEmbed()
            .setDescription(`**${message.author.tag}** is nomming **${member.user.tag}!**`)
            .setColor('RANDOM')
            .setImage(nomGif.url)
            )
        }
    }
}