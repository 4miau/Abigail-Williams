import { Command } from 'discord-akairo'
import { Message, TextChannel } from 'discord.js'

export default class SetRoleLog extends Command {
    public constructor() {
        super('setrolelog', {
            aliases: ['setrolelog', 'rolelogchannel', 'rolelog'],
            category: 'Logging',
            description: {
                content: 'Sets the channel where role logs are posted. The current tag will post the current logs channel. (Leave blank to remove current log channel)',
                usage: 'setrolelog [channel] <-current>',
                examples: ['setrolelog #logs'],
                flags: ['-current']
            },
            channel: 'guild',
            ratelimit: 3,
            args: [
                {
                    id: 'channel',
                    type: 'textChannel'
                },
                {
                    id: 'current',
                    match: 'flag',
                    flag: '-current'
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

    public exec(message: Message, {channel, current}: {channel: TextChannel, current: boolean}): Promise<Message> {
        if (!channel && !current) {
            this.client.settings.delete(message.guild, 'logs.role-logs')
            return message.util!.send('The channel the server currently uses for logging has been removed if any.')    
        }

        if (current) {
            const currChannel = message.guild.channels.resolve(this.client.settings.get(message.guild, 'logs.role-logs', '')) as TextChannel
            return currChannel ? message.util!.send(`The server's current role log channel is #<${currChannel.id}>`) : message.util!.send('This server currently doesn\'t have a channel for role logs')
        }

        this.client.settings.set(message.guild, 'logs.role-logs', channel.id)
        return message.util!.send('New role logs channel has been set.')
    }
}