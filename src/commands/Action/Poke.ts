import { Command } from 'discord-akairo'
import { GuildMember, Message, MessageEmbed } from 'discord.js'

import { _GetAnimeSFW } from '../../util/Functions'

export default class pokeGif extends Command {
    public constructor() {
        super('poke', {
            aliases: ['poke', 'pokes'],
            category: 'Action',
            description: {
                content: 'Just pokes a user... that\'s about it?',
                usage: 'poke [@user]',
                examples: ['poke @user'],
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
        if (!member) return message.util!.send('Provide a member to poke.')
        if (member.user.id === message.author.id) return message.util!.send('Poking yourself is a bit strange..')
        
        const pokeGif = await _GetAnimeSFW('poke')

        return message.util!.send(new MessageEmbed()
            .setDescription(`**${message.author.tag}** poked **${member.user.tag}.**`)
            .setColor('RANDOM')
            .setImage(pokeGif.url)
        )
    }
}