import { Command } from 'discord-akairo'
import { GuildMember, GuildMemberResolvable, Message, MessageEmbed } from 'discord.js'

export default class Gayrate extends Command {
    public constructor() {
        super('gayrate', {
            aliases: ['gayrate'],
            category: 'Fun',
            description: {
                    content: 'Returns a rating of how gay a user is (between 0-100%)',
                    usage: 'gayrate [@user]',
                    examples: ['gayrate @user']
            },
            channel: 'guild',
            clientPermissions: ['EMBED_LINKS'],
            ratelimit: 3,
            args: [
                {
                    id: 'member',
                    type: 'member',
                    default: (msg: Message) => msg.member
                }
            ]
        })
    }

    public exec(message: Message, {member}: {member: GuildMemberResolvable}): Promise<Message> {
        const userResolved: GuildMember = message.guild.members.resolve(member)

        const gayRate: number = Math.floor(Math.random() * 100)

        if (userResolved && userResolved.id !== message.author.id) {
            return message.util!.send(new MessageEmbed()
                .setTitle('Gayrate Result')
                .setColor('RANDOM')
                .addField('gayRate', `${userResolved.displayName} is ${gayRate}% gay`, true)
                .setTimestamp(Date.now())
            )
        } else {
            return message.util!.send(new MessageEmbed()
                .setTitle('Gayrate Result')
                .setColor('RANDOM')
                .addField('gayRate', `you are ${gayRate}% gay`, true)
                .setTimestamp(Date.now())
            )
        }
    }
}