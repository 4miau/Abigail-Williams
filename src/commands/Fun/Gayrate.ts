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

    public exec(message: Message, {member}: {member: GuildMember}): Promise<Message> {
        const gayRate: number = Math.floor(Math.random() * 100)

        if (member && member.id !== message.author.id) {
            return message.util!.send(new MessageEmbed()
                .setTitle('Gayrate Result')
                .setColor('RANDOM')
                .setDescription(`${member.displayName} is rated as **${gayRate}%** gay.`)
                .setFooter(`Executed by ${message.author.tag}`)
                .setTimestamp(Date.now())
            )
        } else {
            return message.util!.send(new MessageEmbed()
                .setTitle('Gayrate Result')
                .setColor('RANDOM')
                .setDescription(`You are rated as being **${gayRate}%** gay.`)
                .setFooter(`Executed by ${message.author.tag}`)
                .setTimestamp(Date.now())
            )
        }
    }
}