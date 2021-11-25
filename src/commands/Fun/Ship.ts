import { Command } from 'discord-akairo'
import { GuildMemberResolvable, GuildMember, Message, MessageEmbed } from 'discord.js'

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

    public exec(message: Message, {memberOne, memberTwo}: {memberOne: GuildMember, memberTwo: GuildMember}): Promise<Message> {
        if (!memberOne || !memberTwo) return message.channel.send('Provide 2 members to ship, Specifically 2..')

        const e = new MessageEmbed()
            .setTitle('The ship has set sail')
            .setDescription(`:ship: ${memberOne} and ${memberTwo} have a ship level of ${Array.prototype.randomRange(0, 100)}%`)

        return message.channel.send({ embeds: [e] })
    }
}