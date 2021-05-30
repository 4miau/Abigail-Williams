import { Command } from 'discord-akairo'
import { GuildMember, Message, MessageEmbed } from 'discord.js'

import { _GetAnimeSFW } from '../../util/Functions'

export default class HoldHand extends Command {
    public constructor() {
        super('holdhand', {
            aliases: ['handhold', 'holdhand', 'holdhands'],
            category: 'Action',
            description: {
                content: 'Holds hands with a user (:flushed:)',
                usage: 'holdhands [@user]',
                examples: ['holdhands @user'],
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
        if (!member) return message.util!.send('Provide a member to hold hands with... that\'s lewd!')
        if (member.user.id === message.author.id) return message.util!.send('Holding hands with yourself... are you that lonely?')
        
        const handHoldGif = await _GetAnimeSFW('handhold')

        return message.util!.send(new MessageEmbed()
            .setDescription(`**${message.author.tag}** is... holding hands with **${member.user.tag}!** WOAH!!`)
            .setColor('RANDOM')
            .setImage(handHoldGif.url)
        )
    }
}