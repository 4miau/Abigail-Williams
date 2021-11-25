import { Command } from 'discord-akairo'
import { Message, TextChannel } from 'discord.js'

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
        const modRole = this.client.settings.get(message.guild, 'modRole', '')
        const hasStaffRole = message.member.permissions.has(['VIEW_AUDIT_LOG', 'MANAGE_MESSAGES'], true) || message.member.roles.cache.has(modRole)

        if (!hasStaffRole) return 'Moderator'
        return null
    }

    public async exec(message: Message): Promise<Message> {
        await message.channel.messages.fetch({ 'limit': 50 }, { cache: true, force: true })
            .then(messages => (message.channel as TextChannel).bulkDelete(messages.filter(msg => msg.author.bot)))
            .catch(void 0)
        
        setTimeout(() => { message.delete() }, 2500)
        return message.channel.send('I have cleaned the channel.')
            .then(msg => {
                setTimeout(() => { msg.delete() }, 5000)
                return msg
            })   
    }
}