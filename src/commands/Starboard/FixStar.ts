import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

export default class FixStar extends Command {
    public constructor() {
        super('fixstar', {
            aliases: ['fixstar', 'fix-star', 'fix-stars'],
            category: 'Starboard',
            description: {
                content: 'Fixes the stars on the starboard for a guild.',
                usage: 'fixstar [messageID]',
                examples: ['fixstar 1234567890'],
            },
            channel: 'guild',
            ratelimit: 3,
            args: [
                {
                    id: 'msg',
                    type: 'message',
                    match: 'rest'
                }
            ]
        })
    }

    //@ts-ignore
    userPermissions(message: Message) {
        const modRole = this.client.settings.get(message.guild, 'modRole', '')
        const hasStaffRole = message.member.permissions.has(['MANAGE_CHANNELS'], true) || message.member.roles.cache.has(modRole)

        if (!hasStaffRole) return 'Moderator'
        return null
    }

    public async exec(message: Message, {msg}: {msg: Message}): Promise<Message> {
        if (!msg) return message.channel.send('There is no attached message, please refer to an actual message.')

        const starboard = this.client.starboards.get(message.guild.id)
        const err = await starboard.fixStar(msg)

        if (err) return message.channel.send(err)
        else return message.channel.send('Successfully fixed the stars for the message!')
    }
}