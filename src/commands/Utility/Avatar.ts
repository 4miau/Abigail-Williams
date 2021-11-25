import { Argument, Command } from 'discord-akairo'
import { Message, MessageEmbed, User, GuildMember, AllowedImageSize } from 'discord.js'

export default class Avatar extends Command {
    public constructor() {
        super('avatar', {
            aliases: ['avatar', 'pfp', 'icon', 'ava'],
            category: 'Utility',
            description: {
                    content: 'Gets the avatar of a member (size must be a number and the flag).',
                    usage: 'avatar [@user] <-size=size>',
                    examples: ['avatar @user', 'avatar 1337', 'avatar miau -size=']
            },
            ratelimit: 3,
            args: [
                {
                    id: 'member',
                    type: Argument.union('string', 'member', 'user'),
                    match: 'rest',
                    default: (msg: Message) => msg.member.id
                },
                {
                    id: 'size',
                    type: (_: Message, str: string): null | number => {
                        if (str && !isNaN(Number(str)) && [16, 32, 64, 128, 256, 512, 1024, 2048].includes(Number(str))) return Number(str)
                        return null
                    },
                    match: 'option',
                    flag: ['-size='],
                    default: 2048
                }
            ]
        })
    }

    public exec(message: Message, {member, size}): Promise<Message> {
        try {
            const user: User = this.client.util.resolveUser(member, this.client.users.cache, false)

            const e = new MessageEmbed()
                .setAuthor(`Avatar | ${user.tag}`)
                .setColor('RANDOM')
                .setDescription(`${user.tag}'s avatar`)
                .setImage(user.displayAvatarURL({ format: 'png', size: size as AllowedImageSize, dynamic: true }))
                .setFooter(`${user.tag}`)
                
            return message.channel.send({ embeds: [e] })
        } catch {
            return message.channel.reply('There was an error retrieving this user, please try again!')
        }
    }
}