import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

export default class Prefix extends Command {
    public constructor() {
        super('prefix', {
            aliases: ['prefix', 'setprefix'],
            category: 'Configuration',
            description: {
                    content: 'Gets/sets the server prefix',
                    usage: 'prefix <newPrefix>',
                    examples: ['prefix a.']
            },
            channel: 'guild',
            ratelimit: 3,
            args: [
                {
                    id: 'prefix',
                    type: 'string'
                }
            ]
        })
    }

    //@ts-ignore
    userPermissions(message: Message) {
        const modRole: string = this.client.settings.get(message.guild, 'modRole', '')
        const hasStaffRole = message.member.hasPermission('ADMINISTRATOR', { checkAdmin: false, checkOwner: true}) || message.member.roles.cache.has(modRole)

        if (!hasStaffRole) return 'Moderator'
        return null
    }

    public async exec(message: Message, {prefix}: {prefix: string}): Promise<Message> {
        if (!prefix) {
            const currentPrefix = this.client.settings.get(message.guild, 'prefix', 'a.')
            return message.util!.send(`The server's current prefix is ${currentPrefix}`)
        }

        if (prefix.length < 10) {
            this.client.settings.set(message.guild, 'prefix', prefix)
            return message.util!.send(`I have set the new server prefix to ${prefix}`)
        }

        return message.util!.send('Please make your new prefix between 1-10 characters.')
    }
}