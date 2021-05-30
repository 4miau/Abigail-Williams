import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

export default class Clean extends Command {
    public constructor() {
        super('clean', {
            aliases: ['clean'],
            category: 'Moderation',
            description: {
                content: 'Clears bot messages from a channel.',
                usage: 'clean',
                examples: ['clean'],
            },
            channel: 'guild',
            ratelimit: 3,
        })
    }

    //@ts-ignore
    userPermissions(message: Message) {
        const modRole: string = this.client.settings.get(message.guild, 'modRole', '')
        const hasStaffRole = message.member.hasPermission(['VIEW_AUDIT_LOG', 'MANAGE_MESSAGES'], { checkAdmin: true, checkOwner: true}) || message.member.roles.cache.has(modRole)

        if (!hasStaffRole) return 'Moderator'
        return null
    }

    public async exec(message: Message): Promise<Message> {
        await message.channel.messages.fetch({ 'limit': 50 }, true, true)
            .then(msgCol => message.channel.messages.channel.bulkDelete(msgCol.filter(msg => msg.author.bot)))
            .catch(void 0)
        
        message.delete({'timeout': 2500})
        return (await message.util!.send('I have cleaned the channel.')).delete({ 'timeout': 5000})
    }
}