import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

export default class WelcomeMessage extends Command {
    public constructor() {
        super('welcomemessage', {
            aliases: ['welcomemessage', 'setwelcomemessage'],
            category: 'Configuration',
            description: {
                content: 'Sets a welcome message for when a new user joins the server. (Leave empty to remove the welcome message)',
                usage: 'welcomemessage [message]',
                examples: ['welcomemessage Welcome new {user}!'],
                tags: [
                    '{user} - Mentions the user',
                    '{userName} - Displays the user\'s name',
                    '{nick} - Displays the user\'s nickname (or username if they have none)',
                    '{server} - Displays the server name',
                    '{time} - Displays the time the user joined (format: YYYY/MM/DD hh:mm:ss, 24hr format)'
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
        const modRole = this.client.settings.get(message.guild, 'modRole', '')
        const hasStaffRole = message.member.permissions.has('MANAGE_GUILD', true) || message.member.roles.cache.has(modRole)

        if (!hasStaffRole) return 'Moderator'
        return null
    }

    public async exec(message: Message, {content}: {content: string}): Promise<Message> {
        if (!content) {
            this.client.settings.delete(message.guild, 'join-leave.joinMessage')
            return message.channel.send('I have removed this server\'s current join message.')
        }

        this.client.settings.set(message.guild, 'join-leave.joinMessage', content)
        return message.channel.send('I have set this server\'s new join message.')
    }
}