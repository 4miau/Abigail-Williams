import { Command } from 'discord-akairo'
import { Message, TextChannel } from 'discord.js'

export default class SetRoleLog extends Command {
    public constructor() {
        super('setrolelog', {
            aliases: ['setrolelog', 'rolelogchannel', 'rolelog'],
            category: 'Logging',
            description: {
                content: 'Sets the channel where role logs are posted. (Leave blank to remove current log channel)',
                usage: 'setrolelog <channel>',
                examples: ['setrolelog #logs']
            },
            channel: 'guild',
            ratelimit: 3,
            args: [
                {
                    id: 'channel',
                    type: 'textChannel'
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

    public exec(message: Message, {channel}: {channel: TextChannel}): Promise<Message> {
        if (!channel) {
            this.client.settings.delete(message.guild, 'logs.role-logs')
            return message.channel.send('The channel the server currently uses for logging has been removed if any.')    
        }

        this.client.settings.set(message.guild, 'logs.role-logs', channel.id)
        return message.channel.send(`I will now post role logs in ${channel}.`)
    }
}