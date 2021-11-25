import { Command } from 'discord-akairo'
import { Message, TextChannel } from 'discord.js'

export default class SetUserLog extends Command {
    public constructor() {
        super('setuserlog', {
            aliases: ['setuserlog', 'userlog', 'userlogs'],
            category: 'Logging',
            description: {
                content: 'Sets the channel to post user-logs. (Leave channel blank to remove)',
                usage: 'userlog <channel>',
                examples: ['userlog #logs'],
            },
            channel: 'guild',
            ownerOnly: true,
            ratelimit: 3,
            args: [
                {
                    id: 'channel',
                    type: 'textChannel',
                }
            ]
        })
    }

    //@ts-ignore
    userPermissions(message: Message) {
        const modRole = this.client.settings.get(message.guild, 'modRole', '')
        const hasStaffRole = message.member.permissions.has('ADMINISTRATOR', true) || message.member.roles.cache.has(modRole)

        if (!hasStaffRole) return 'Moderator'
        return null
    }

    public async exec(message: Message, {channel}: {channel: TextChannel}): Promise<Message> {
        if (!channel) {
            this.client.settings.delete(message.guild, 'logs.user-logs')
            return message.channel.send('I have removed the current user-logs channel, if any.')
        }

        this.client.settings.set(message.guild, 'logs.user-logs', channel.id)
        return message.channel.send(`I will now post user logs in ${channel}.`)
    }
}