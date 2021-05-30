import { Command } from 'discord-akairo'
import { GuildMember, Message, MessageEmbed } from 'discord.js'

import { _GetAnimeSFW } from '../../util/Functions'

export default class Yeet extends Command {
    public constructor() {
        super('yeet', {
            aliases: ['yeet', 'yeets'],
            category: 'Action',
            description: {
                content: 'Yeets a user... YAHYEET!',
                usage: 'yeet [@user]',
                examples: ['yeet @user'],
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
        if (!member) return message.util!.send('Please provide a member to yeet')
        if (member.user.id === message.author.id) return message.util!.send('You can\'t really... yeet yourself you know?')

        const yeetGif = await _GetAnimeSFW('yeet')

        return message.util!.send(new MessageEmbed()
            .setDescription(`**${message.author.tag}** has yeeted **${member.user.tag}!** Holy!`)
            .setColor('RANDOM')
            .setImage(yeetGif.url)
        )
    }
}