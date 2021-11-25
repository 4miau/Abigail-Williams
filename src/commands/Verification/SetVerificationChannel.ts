import { Command, Argument } from 'discord-akairo'
import { Message, TextChannel } from 'discord.js'

export default class SetVerificationChannel extends Command {
    public constructor() {
        super('setverificationchannel', {
            aliases: ['setverificationchannel', 'verificationchannel'],
            category: 'Verification',
            description: {
                content: 'Sets the channel members must type verify in. Typing nothing or an invalid value will reset the channel.',
                usage: 'setverificationchannel <channel>',
                examples: ['setverificationchannel #verify'],
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
        const hasStaffRole = message.member.permissions.has('MANAGE_CHANNELS', true) || message.member.roles.cache.has(modRole)

        if (!hasStaffRole) return 'Server administrator or staff role'
        return null
    }

    public exec(message: Message, {channel}: { channel: TextChannel}): Promise<Message> {
        if (channel) {
            this.client.settings.set(message.guild, 'verification.verification-channel', channel.id)
            this.client.settings.set(message.guild, 'verification.enabled', true)
            return message.channel.send(`Successfully set ${channel} as the new verification channel.`)
        }
        else {
            this.client.settings.delete(message.guild, 'verification.verification-channel')
            this.client.settings.set(message.guild, 'verification.enabled', false)
            return message.channel.send('I have successfully removed the guild\'s verification channel.')
        }
    }
}