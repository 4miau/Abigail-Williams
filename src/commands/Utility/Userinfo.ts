import { Command } from 'discord-akairo'
import { Message, GuildMember, MessageEmbed } from 'discord.js'
import moment from 'moment'

import { getJoinPosition, splitArrayNth } from '../../utils/Functions'
import { Colours } from '../../utils/Colours'


export default class UserInfo extends Command {
    public constructor() {
        super('userinfo', {
            aliases: ['userinfo', 'info'],
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
            return message.util!.send(new MessageEmbed()
                .setAuthor(member.user.tag, member.user.displayAvatarURL())
                .setThumbnail(member.user.displayAvatarURL())
                .setColor(Colours.Green)
                .addField('ID', member.user.id, true)
                .addField('Nickname', member.nickname ? member.nickname : 'None', true)
                .addField('Account Created', moment(member.user.createdAt).format('dddd, MMMM Do YYYY @ h:mm:ss a') + '\u200B\u200B')
                .addField('Join Date', moment(member.joinedAt).format('dddd, MMMM Do YYYY @ h:mm:ss a') + '\u200B\u200B')
                .addField('Join Position', getJoinPosition(member, message.guild))
                .addField(`Roles [${member.roles.cache.size - 1}]`, `${ member.roles.cache.size - 1 > 0 ? splitArrayNth(member.roles.cache.map(r => r)
                    .sort((a, b) => b.position - a.position)
                    .map(role => role.name )
                    .filter(name => name !== '@everyone'), 3).join(', ') : 'None'}`
                )
            )
        }

        return message.util!.send('Please provide a member.')
    }
}