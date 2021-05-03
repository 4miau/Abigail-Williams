import { Command } from 'discord-akairo'
import { GuildMember, GuildMemberResolvable } from 'discord.js'
import { Message } from 'discord.js'

export default class SetNickname extends Command {
    public constructor() {
        super('setnickname', {
            aliases: ['setnickname', 'setnick'],
            category: 'Moderation',
            description: [
                {
                    content: `Manually set a user's nickname (if blank, resets nickname)`,
                    usage: ['setnick [@user] [newnick]'],
                    examples: ['setnick @user nickname', 'setnickname @user']
                }
            ],
            userPermissions: ['MANAGE_NICKNAMES'],
            ratelimit: 3,
            args: [
                {
                    id: 'member',
                    type: 'member'
                },
                {
                    id: 'nickname',
                    type: 'string',
                    match: 'rest'
                }
            ]
        })
    }

    public async exec(message: Message, {member, nickname}: {member: GuildMemberResolvable, nickname: string}): Promise<Message> {
        const resolvedUser: GuildMember = message.guild.members.resolve(member)

        try {
            await resolvedUser.setNickname(nickname)
            return message.util!.send(`Successfully changed user's nickname`)
        } catch (err) {
            return message.util!.send(`Could not change user's nickname, please try again.`)
        }
        
    }
}

//TODO: Check role position