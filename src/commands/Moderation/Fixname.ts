import { Command } from 'discord-akairo'
import { Message, GuildMember } from 'discord.js'

import { fixnameMax } from '../../utils/Constants'

export default class Fixname extends Command {
    public constructor() {
        super('fixname', {
            aliases: ['fixname', 'fn'],
            category: 'Moderation',
            description: [
                {
                    content: 'Fixes the username of a member',
                    usage: 'fixname [@user]',
                    examples: ['fixname @userWithUnicode']
                }
            ],
            channel: 'guild',
            userPermissions: ['MANAGE_NICKNAMES'],
            clientPermissions: ['MANAGE_NICKNAMES'],
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

    public async exec(message: Message, {member}: {member: GuildMember}): Promise<Message> {
        try {
            await member.setNickname('Fixed Name #' + Math.floor(Math.random() * fixnameMax))
            return message.util!.send(`${member.user.tag}'s nickname has been set to ${member.nickname}`)
        } catch (err) {
            return message.util!.reply(`I am unable to change that user's nickname.`)
        }
       
    }
}