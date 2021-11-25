import { Argument, Command } from 'discord-akairo'
import { Message, TextChannel } from 'discord.js'

export default class Slowmode extends Command {
    public constructor() {
        super('slowmode', {
            aliases: ['slowmode', 'sm'],
            category: 'Moderation',
            description: {
                    content: 'Sets a slowmode in a channel',
                    usage: 'sm <channel> [timer]',
                    examples: ['sm 5m', 'sm #general 5s']
            },
            channel: 'guild',
            ratelimit: 3,
            args: [
                {
                    id: 'channel',
                    type: 'textChannel',
                    unordered: true
                },
                {
                    id: 'timer',
                    type: Argument.union('time'),
                    default: 0,
                    unordered: true
                    
                }
            ]
        })
    }

    //@ts-ignore
    userPermissions(message: Message) {
        const modRole = this.client.settings.get(message.guild, 'modRole', '')
        const hasStaffRole = message.member.permissions.has('MANAGE_CHANNELS', true) || message.member.roles.cache.has(modRole)

        if (!hasStaffRole) return 'Moderator'
        return null
    }

    public exec(message: Message, {channel, timer}: {channel: TextChannel, timer: number}): Promise<Message> {
        if (!channel && !timer) return message.channel.send('You need to at the very least provide a timer for the command to work.')
        if (timer < 5000 && timer !== 0) return message.channel.send('Please add a time modifier if you are not using milliseconds (e.g. 5s, 1h)')

        if (channel) {
            try {
                channel.edit({ rateLimitPerUser: Math.floor(timer / 1000)})
                return message.channel.send('Slowmode set successfully.')
            } catch {
                return message.channel.send('Please input a valid time.')
            }
        }
        else {
            try {
                (message.channel as TextChannel).edit({ rateLimitPerUser: Math.floor(timer / 1000)})
                return message.channel.send('Slowmode set successfully.')
            } catch {
                return message.channel.send('Please provide a time.')
            }
        }
    }
}