import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

export default class StarboardThreshold extends Command {
    public constructor() {
        super('starboardthreshold', {
            aliases: ['starboardthreshold', 'sbthreshold'],
            category: 'Starboard',
            description: {
                content: 'Sets the threshold of stars before being posted onto the starboard.',
                usage: 'starboardthreshold [number]',
                examples: ['starboardthreshold 3'],
            },
            ownerOnly: true,
            channel: 'guild',
            ratelimit: 3,
            args: [
                {
                    id: 'threshold',
                    type: 'number',

                }
            ]
        })
    }

    //@ts-ignore
    userPermissions(message: Message) {
        const modRole: string = this.client.settings.get(message.guild, 'modRole', '')
        const hasStaffRole = message.member.permissions.has('MANAGE_GUILD', true) || message.member.roles.cache.has(modRole)

        if (!hasStaffRole) return 'Administrator'
        return null
    }

    public exec(message: Message, {threshold}: {threshold: number}): Promise<Message> {
        if (!threshold) return message.channel.send('You need to provide a number to set the new threshold.')

        this.client.settings.set(message.guild, 'starboard.threshold', threshold)
        return message.channel.send('New starboard threshold set successfully!')
    }
}