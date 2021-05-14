import { Command } from 'discord-akairo'
import { GuildMember, Message, MessageEmbed } from 'discord.js'

import { _GetAnimeSFW } from '../../util/Functions'

export default class Wink extends Command {
    public constructor() {
        super('wink', {
            aliases: ['wink', 'winks'],
            category: 'Action',
            description: {
                content: 'Winks at a user...',
                usage: 'wink [@user]',
                examples: ['wink @user'],
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
        const winkGif = await _GetAnimeSFW('wink')
        
        if (!member || member.user.id === message.author.id) {
            return message.util!.send(new MessageEmbed()
                .setDescription(`**${message.author.tag}** winked!`)
                .setColor('RANDOM')
                .setImage(winkGif.url)
            )
        } else {
            return message.util!.send(new MessageEmbed()
                .setDescription(`**${message.author.tag}** winks at **${member.user.tag}!**`)
                .setColor('RANDOM')
                .setImage(winkGif.url)
            )
        }


    }
}