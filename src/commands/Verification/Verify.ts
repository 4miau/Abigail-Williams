import { Command } from 'discord-akairo'
import { Message, TextChannel } from 'discord.js'

import { Captcha } from '../../util/functions/guild'

export default class Verify extends Command {
    public constructor() {
        super('verify', {
            aliases: ['verify'],
            category: 'Verification',
            description: {
                content: 'Allows you to verify for the guild.',
                usage: 'verify',
                examples: ['verify'],
            },
            channel: 'guild',
            ratelimit: 3
        })
    }

    public async exec(message: Message): Promise<Message> {
        const hasVerification: boolean = this.client.settings.get(message.guild, 'verification.enabled', false)
        const verificationRole = this.client.settings.get(message.guild, 'verification.verified-role', '')

        if (!hasVerification) return message.channel.send('Sorry but this server has the verification feature disabled.')
        else {
            await Captcha(message.channel as TextChannel, message.member)
            if (message.member.roles.cache.has(verificationRole)) {
                const confirmed = await message.channel.send('You have now been verified.')
                setTimeout(() => {
                    confirmed.delete()
                    message.delete()
                }, 3000)
            }
        }
    }
}