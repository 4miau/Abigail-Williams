import { Command } from 'discord-akairo'
import { GuildMember, Message, MessageEmbed } from 'discord.js'

import { Colours } from '../../util/Colours'
import { chunkNewLine } from '../../util/Functions'

export default class Roles extends Command {
    public constructor() {
        super('roles', {
            aliases: ['roles'],
            category: 'Utility',
            description: {
                content: 'Views the roles of a user or yourself.',
                usage: 'roles <@user>',
                examples: ['roles', 'roles @user']
            },
            ratelimit: 3,
            args: [
                {
                    id: 'member',
                    type: 'member',
                    default: (msg: Message) => msg.member
                },
                {
                    id: 'server',
                    type: 'string',
                    match: 'text'
                }
            ]
        })
    }

    public async exec(message: Message, {member, server}: {member: GuildMember, server: string}): Promise<Message> {
        if (server === 'server') {
            return await message.util!.send(new MessageEmbed()
                .setAuthor(`${message.guild.name}`, message.guild.iconURL())
                .setThumbnail(message.guild.iconURL())
                .setColor(Colours.SkyBlue)
                .addField(`**${message.guild.name}'s total roles:** [${message.guild.roles.cache.size - 1}]`, `${member.guild.roles.cache.size - 1 > 0 ?
                    chunkNewLine(message.guild.roles.cache.map(r => r)
                    .sort((a, b) => b.position - a.position)
                    .map(role => role.name )
                    .filter(name => name !== '@everyone'), 3).join(', ') : 'None'}`)
            )
        }

        return await message.util.send(new MessageEmbed()
            .setAuthor(`${member.user.tag}`, member.user.displayAvatarURL())
            .setThumbnail(member.user.displayAvatarURL())
            .setColor(Colours.SkyBlue)
            .addField(`**Roles:** [${member.roles.cache.size - 1}]`, `${member.roles.cache.size - 1 > 0 ? chunkNewLine(member.roles.cache.map(r => r)
                .sort((a, b) => b.position - a.position)
                .map(role => role.name)
                .filter(name => name !== '@everyone'), 3).join(', ') : 'None'}`)
        )
    }
}