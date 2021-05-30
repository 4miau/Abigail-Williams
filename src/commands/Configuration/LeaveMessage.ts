import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

export default class LeaveMessage extends Command {
    public constructor() {
        super('leavemessage', {
            aliases: ['leavemessage', 'setleavemessage'],
            category: 'Configuration',
            description: {
                content: 'Sets the message when a user leaves the server (Leave empty to remove the leave message)',
                usage: 'leavemessage [message]',
                examples: ['leavemessage rip, {user} has left the server.'],
                tags: [
                    '{user} - Mentions the user',
                    '{userName} - Displays the user\'s name',
                    '{nick} - Displays the user\'s nickname (or username if they have none)',
                    '{server} - Displays the server name',
                    '{time} - Displays the time the user left (format: YYYY/MM/DD hh:mm:ss, 24hr format)'
                ]
            },
            channel: 'guild',
            ratelimit: 3,
            args: [
                {
                    id: 'content',
                    type: 'string',
                    match: 'rest'
                }
            ]
        })
    }

    //@ts-ignore
    userPermissions(message: Message) {
        const modRole: string = this.client.settings.get(message.guild, 'modRole', '')
        const hasStaffRole = message.member.hasPermission('MANAGE_GUILD', { checkAdmin: true, checkOwner: true}) || message.member.roles.cache.has(modRole)

        if (!hasStaffRole) return 'Moderator'
        return null
    }

    public async exec(message: Message, {content}: {content: string}): Promise<Message> {
        if (!content) {
            this.client.settings.delete(message.guild, 'join-leave.leaveMessage')
            return message.util!.send('I have removed this server\'s current leave message.')
        }

        this.client.settings.set(message.guild, 'join-leave.leaveMessage', content)
        return message.util!.send('I have set this server\'s new leave message.')
    }
}