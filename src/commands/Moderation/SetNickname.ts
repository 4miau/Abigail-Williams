import { Command } from 'discord-akairo'
import { GuildMember } from 'discord.js'
import { Message } from 'discord.js'

export default class SetNickname extends Command {
    public constructor() {
        super('setnickname', {
            aliases: ['setnickname', 'setnick'],
            category: 'Moderation',
            description: {
                    content: `Manually set a user's nickname (if blank, resets nickname)`,
                    usage: 'setnick [@user] [newnick]',
                    examples: ['setnick @user nickname', 'setnickname @user']
            },
            channel: 'guild',
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

    public async exec(message: Message, {member, nickname}: {member: GuildMember, nickname: string}): Promise<Message> {
        if (!member.manageable) return message.util!.send('I can not change this user\'s nickname, you should move my role above theirs!')

        await member.setNickname(nickname)
        return message.util!.send(`I have set this user\'s nickname successfully.`)
    }
}