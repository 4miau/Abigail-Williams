import { Argument, Command } from 'discord-akairo'
import { Message } from 'discord.js'

export default class SetWarnThreshold extends Command {
    public constructor() {
        super('setwarnthreshold', {
            aliases: ['setwarnthreshold'],
            category: 'Configuration',
            description: {
                content: 'Allows you to set the warn threshold (amount of warns before mute). Default is 3.',
                usage: 'mutethreshold [number]',
                examples: ['mutethreshold 3'],
            },
            channel: 'guild',
            ratelimit: 3,
            args: [
                {
                    id: 'threshold',
                    type: Argument.range('number', 1, 10, true),
                    default: 3
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

    public exec(message: Message, {threshold}): Promise<Message> {
        this.client.settings.set(message.guild, 'mute-threshold', threshold)
        return message.channel.send(`Successfully set the warn threshold for this server to ${threshold}`)
    }
}