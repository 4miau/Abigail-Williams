import { Command } from 'discord-akairo'
import { GuildMemberResolvable, GuildMember, Message, MessageEmbed } from 'discord.js'

import { getRandomIntRange } from '../../utils/Functions'

export default class Ship extends Command {
    public constructor() {
        super('ship', {
            aliases: ['ship'],
            category: 'Fun',
            channel: 'guild',
            description: {
                    content: 'Ships between 2 users',
                    usage: 'ship [@user1] [@user2]',
                    examples: ['ship @user1 @user2']
            },
            ratelimit: 3,
            args: [
                {
                    id: 'memberOne',
                    type: 'member'
                },
                {
                    id: 'memberTwo',
                    type: 'member'
                }
            ]
        })
    }

    public exec(message: Message, {memberOne, memberTwo}: {memberOne: GuildMemberResolvable, memberTwo: GuildMemberResolvable}): Promise<Message> {
        const userOne: GuildMember = message.guild.members.resolve(memberOne)
        const userTwo: GuildMember = message.guild.members.resolve(memberTwo)

        if (userOne && userTwo) {
            return message.util!.send(new MessageEmbed()
                .setTitle('The ship has set sail')
                .setDescription(`:ship: ${userOne} and ${userTwo} have a ship level of ${getRandomIntRange(0, 99)}%`)
            )
        } else {
            message.util!.send('Please provide 2 members to ship.')
        }
    }
}