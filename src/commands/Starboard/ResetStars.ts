import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

export default class ResetStars extends Command {
    public constructor() {
        super('resetstars', {
            aliases: ['resetstars', 'reset-stars'],
            category: 'Starboard',
            description: {
                content: 'Resets all stars within the guild, be careful using this.',
                usage: 'resetstars',
                examples: [''],
            },
            channel: 'guild',
            ratelimit: 3,
        })
    }

    //@ts-ignore
    userPermissions(message: Message) {
        const modRole: string = this.client.settings.get(message.guild, 'modRole', '')
        const hasStaffRole = message.member.hasPermission('MANAGE_GUILD', { checkAdmin: true, checkOwner: true}) || message.member.roles.cache.has(modRole)

        if (!hasStaffRole) return 'Moderator'
        return null
    }

    public async exec(message: Message): Promise<Message> {
        message.channel.send('Are you sure that you would like to do that? (\'y\', \'yes\', \'ye\' are all valid answers)')

        const reply = (await message.channel.awaitMessages((msg: Message) => msg.author.id === message.author.id, { max: 1, time: 30000, })).first().content

        if (reply && (/^y(?:e(?:a|s)?)?$/i).test(reply)) {
            await this.client.starboards.get(message.guild.id).destroy()
            return message.util!.send('Starboard for your server has been reset completely now.')
        }

        return message.util!.send('I have cancelled the resetting of your starboard.')
    }
}