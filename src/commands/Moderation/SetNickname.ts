import { Command } from 'discord-akairo'
import { GuildMember, Message } from 'discord.js'

export default class SetNickname extends Command {
    public constructor() {
        super('setnickname', {
            aliases: ['setnickname', 'setnick'],
            category: 'Moderation',
            description: {
                    content: 'Manually set a user\'s nickname (if blank, resets nickname)',
                    usage: 'setnick [@user] [newnick]',
                    examples: ['setnick @user nickname', 'setnickname @user']
            },
            channel: 'guild',
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

    //@ts-ignore
    userPermissions(message: Message) {
        const modRole = this.client.settings.get(message.guild, 'modRole', '')
        const hasStaffRole = message.member.permissions.has('MANAGE_NICKNAMES', true) || message.member.roles.cache.has(modRole)

        if (!hasStaffRole) return 'Moderator'
        return null
    }

    public async exec(message: Message, {member, nickname}: {member: GuildMember, nickname: string}): Promise<Message> {
        if (!member.manageable) return message.channel.send('I can not change this user\'s nickname, you should move my role above theirs!')

        await member.setNickname(nickname)
        return message.channel.send('I have set this user\'s nickname successfully.')
    }
}