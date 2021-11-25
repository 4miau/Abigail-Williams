import { Command } from 'discord-akairo'
import { Message, GuildMember } from 'discord.js'

import { fixnameMax } from '../../util/Constants'

export default class Fixname extends Command {
    public constructor() {
        super('fixname', {
            aliases: ['fixname', 'fn'],
            category: 'Moderation',
            description: {
                    content: 'Fixes the username of a member',
                    usage: 'fixname [@user]',
                    examples: ['fixname @userWithUnicode']
            },
            channel: 'guild',
            ratelimit: 3,
            args: [
                {
                    id: 'member',
                    type: 'member',
                    match: 'rest'
                }
            ]
        })
    }

    //@ts-ignore
    userPermissions(message: Message) {
        const modRole = this.client.settings.get(message.guild, 'modRole', '')
        const hasStaffRole = message.member.permissions.has('MANAGE_NICKNAMES', true) || message.member.roles.cache.has(modRole)

        if (!hasStaffRole) return 'Moderator'
        return null
    }

    public async exec(message: Message, {member}: {member: GuildMember}): Promise<Message> {
        try {
            await member.setNickname('Fixed Name #' + Math.floor(Math.random() * fixnameMax))
            return message.channel.send(`${member.user.tag}'s nickname has been set to ${member.nickname}`)
        } catch {
            return message.reply('I am unable to change that user\'s nickname.')
        }  
    }
}