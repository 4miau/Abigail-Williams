import { Command } from 'discord-akairo'
import { Message, TextChannel } from 'discord.js'

export default class SetModlog extends Command {
    public constructor() {
        super('setmodlog', {
            aliases: ['setmodlog', 'modlog', 'setmodlogchannel'],
            category: 'Logging',
            description: {
                content: 'Sets the channel to post modlogs in.',
                usage: 'setmodlog <channel>',
                examples: ['setmodlog #modlogs'],
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
        const hasStaffRole = message.member.permissions.has(['VIEW_AUDIT_LOG', 'MANAGE_GUILD'], true) || message.member.roles.cache.has(modRole)

        if (!hasStaffRole) return 'Moderator (or VIEW_AUDIT_LOG & MANAGE_GUILD permissions) missing.'
        return null
    }

    public async exec(message: Message, {channel}: {channel: TextChannel}): Promise<Message> {
        if (!channel) {
            await this.client.settings.delete(message.guild, 'logs.mod-logs')
            return message.channel.send('I have removed the server\'s current modlog channel, if any.')
        }

        this.client.settings.set(message.guild, 'logs.mod-logs', channel.id)
        return message.channel.send(`I will now post modlogs in ${channel}.`)
    }
}

//Events to add: guildBanAdd, guildBanRemove, guildMemberRemove