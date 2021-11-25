import { Command } from 'discord-akairo'
import { Message, GuildMember, MessageEmbed } from 'discord.js'
import moment from 'moment'

import { getJoinPosition } from '../../util/functions/guild'
import { Colours } from '../../util/Colours'


export default class UserInfo extends Command {
    public constructor() {
        super('userinfo', {
            aliases: ['userinfo', 'info', 'ui'],
            category: 'Utility',
            description: {
                    content: 'Retrieves information on a user',
                    usage: 'userinfo <@member>',
                    examples: ['info', 'info @user']
            },
            channel: 'guild',
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
        if (member) {
            const e = new MessageEmbed()
                .setAuthor(member.user.tag, member.user.displayAvatarURL())
                .setThumbnail(member.user.displayAvatarURL())
                .setColor(Colours.Green)
                .addField('ID', member.user.id, true)
                .addField('Nickname', member.nickname ? member.nickname : 'None', true)
                .addField('Account Created', moment(member.user.createdAt).format('dddd, MMMM Do YYYY @ h:mm:ss a') + '\u200B\u200B')
                .addField('Join Date', moment(member.joinedAt).format('dddd, MMMM Do YYYY @ h:mm:ss a') + '\u200B\u200B')
                .addField('Join Position', `${getJoinPosition(member, message.guild)}`)
                .addField(`Roles [${member.roles.cache.size - 1}]`, `${ member.roles.cache.size - 1 > 0 ? member.roles.cache.map(r => r)
                    .sort((a, b) => b.position - a.position)
                    .map(role => role.name )
                    .filter(name => name !== '@everyone').join(', ') : 'None'}`
                )

            return message.channel.send({ embeds: [e] })
        }
        else return message.channel.send('Please provide a member.')
    }
}