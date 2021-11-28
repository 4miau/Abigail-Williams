import { Argument, Command } from 'discord-akairo'
import { Message, MessageEmbed, GuildMember, AllowedImageSize } from 'discord.js'

import { getUserData } from '../../util/functions/guildasync'

export default class Avatar extends Command {
    public constructor() {
        super('avatar', {
            aliases: ['avatar', 'pfp', 'icon', 'ava'],
            category: 'Utility',
            description: {
                    content: 'Gets the avatar of a member (size must be a number and the flag).',
                    usage: 'avatar [@user] <-size=size>',
                    examples: ['avatar @user', 'avatar 1337', 'avatar miau -size=256']
            },
            ratelimit: 3,
            args: [
                {
                    id: 'member',
                    type: Argument.union('member', 'string'),
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

    public async exec(message: Message, {member, size}: { member: GuildMember | string, size: number }): Promise<Message> {
        const e = new MessageEmbed()
            .setColor('RANDOM')

        if (!member) return message.channel.send({ embeds: [this.guildMemberEmbed(message.member, size)] })
        else if (member instanceof GuildMember) return message.channel.send({ embeds: [this.guildMemberEmbed(member, size) ] })
        else if (!isNaN(Number(member))) {
            try {
                const user = await getUserData(member as string)
                if (!user) throw new Error('Failed to get user data or avatar.')
                
                e
                    .setAuthor(`Avatar | ${user.username}#${user.discriminator}`)
                    .setDescription(`${user.username}#${user.discriminator}'s avatar`)
                    .setImage(`https://dislookup.am2i9.ml/api/avatar/${user.id}.png?size=${size}`)
                    .setFooter(`${user.username}#${user.discriminator}`)
                return message.channel.send({ embeds: [e] })
            } catch (err) {
                this.client.logger.log('ERROR', err)
            }
        }

        member = message.member
        return message.channel.send({ embeds: [this.guildMemberEmbed(member, size) ] })
    }

    private guildMemberEmbed(member: GuildMember, size: number) {
        return new MessageEmbed()
            .setAuthor(`Avatar | ${member.user.tag}`)
            .setDescription(`${member.user.tag}'s avatar`)
            .setImage(member.user.displayAvatarURL({ format: 'png', size: size as AllowedImageSize, dynamic: true }))
            .setFooter(`${member.user.tag}`)
    }
}