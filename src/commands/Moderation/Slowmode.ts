import { Command } from 'discord-akairo'
import { Message, GuildChannel, GuildChannelResolvable, TextChannel } from 'discord.js'
import ms from 'ms'

import { secondsConvert, slowmodeRange, ZERO } from '../../utils/Constants'

export default class Slowmode extends Command {
    public constructor() {
        super('slowmode', {
            aliases: ['slowmode', 'sm'],
            category: 'Moderation',
            description: [
                {
                    content: 'Sets a slowmode in a channel',
                    usage: 'sm <channel> [timer]',
                    examples: ['sm 5m', 'sm #general 5s']
                }
            ],
            userPermissions: ['MANAGE_CHANNELS'],
            clientPermissions: ['MANAGE_CHANNELS'],
            ratelimit: 3,
            args: [
                {
                    id: 'channel',
                    type: 'string'
                },
                {
                    id: 'timer',
                    type: 'string'
                }
            ]
        })
    }

    public exec(message: Message, {channel, timer}: {channel: GuildChannelResolvable, timer: string}): Promise<Message> {
        if (channel.toString() && !channel.toString().includes('<#')) {
            if (isNaN(parseInt(channel.toString()))) {
                const textChannel: GuildChannel = message.guild.channels.resolve(channel)

                try {
                    const newTimer: number = Number(ms(timer))

                    textChannel.edit({ rateLimitPerUser: newTimer / secondsConvert})
                } catch (err) {
                    return message.util!.send('Please input a valid time.')
                }
            } else {
                const newTimer: number = Number(ms(channel.toString()))

                try {
                    const currentChannelID: string = message.channel.id
                    const currentChannel: GuildChannel = message.guild.channels.resolve(currentChannelID)

                    if (slowmodeRange.includes(newTimer / secondsConvert)) {
                        currentChannel.edit({ rateLimitPerUser: newTimer / secondsConvert})
                        return message.util!.send('The slowmode for this channel has been set successfully.')
                    } else {
                        throw new Error
                    }
                } catch {
                    return message.util!.send('Not a valid timer to set for the slowmode.')
                }
            }
        } else {
            try {
                const textChannel: GuildChannel = message.mentions.channels.first()

                textChannel.edit({ rateLimitPerUser: Number(ms(timer)) / secondsConvert})
                return message.util!.send('Slowmode has been set successfully.')
            } catch (err) {
                return message.util!.send('Error trying to set the slowmode, please try again.')
            }
        }
    }
}

//TODO: CLEAN UP SLOWMODE, VERY DIRTY CODE AND CAN EASILY BE CONDENSED