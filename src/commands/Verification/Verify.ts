import { Command } from 'discord-akairo'
import { Message, TextChannel } from 'discord.js'

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
        const hasVerification: boolean = this.client.settings.get(message.guild, 'verify-enabled', false)
        const verificationRole = this.client.settings.get(message.guild, 'verified-role', '')

        if (!hasVerification) return message.channel.send('Sorry but this server has the verification feature disabled.')
        else {
            const captcha = this.client.serviceHandler.modules.get('managecaptcha')
            await captcha.exec(message.channel as TextChannel, message.member)

            if (message.member.roles.cache.has(verificationRole)) {
                const confirmed = await message.channel.send('You have now been verified.')
                setTimeout(() => {
                    confirmed.delete().catch(void 0)
                    message.delete().catch(void 0)
                }, 3000)
            }
        }
    }
}