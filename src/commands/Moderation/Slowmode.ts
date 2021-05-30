import { Argument, Command } from 'discord-akairo'
import { Message, GuildChannel, GuildChannelResolvable, TextChannel } from 'discord.js'
import ms from 'ms'

import { secondsConvert } from '../../util/Constants'

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
            userPermissions: ['MANAGE_CHANNELS'],
            clientPermissions: ['MANAGE_CHANNELS'],
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

    public exec(message: Message, {channel, timer}: {channel: TextChannel, timer: number}): Promise<Message> {
        if (!channel && !timer) return message.util.send('You need to at the very least provide a timer for the command to work.')
        if (timer < 5000 && timer !== 0) return message.util!.send('Please add a time modifier if you are not using milliseconds (e.g. 5s, 1h)')

        if (channel) {
            try {
                channel.edit({ rateLimitPerUser: Math.floor(timer / 1000)})
                return message.util!.send('Slowmode set successfully.')
            } catch {
                return message.util!.send('Please input a valid time.')
            }
        }
        else {
            try {
                (message.channel as TextChannel).edit({ rateLimitPerUser: Math.floor(timer / 1000)})
                return message.util!.send('Slowmode set successfully.')
            } catch {
                return message.util!.send('Please provide a time.')
            }
        }
    }
}