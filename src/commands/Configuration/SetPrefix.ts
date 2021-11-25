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
                    examples: ['prefix', 'prefix a.']
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
        const modRole = this.client.settings.get(message.guild, 'modRole', '')
        const hasStaffRole = message.member.permissions.has('ADMINISTRATOR', true) || message.member.roles.cache.has(modRole)

        if (!hasStaffRole) return 'Moderator'
        return null
    }

    public async exec(message: Message, {prefix}: {prefix: string}): Promise<Message> {
        const serverPrefix = this.client.settings.get(message.guild, 'prefix', 'a.')
        if (!prefix) return message.channel.send(`The server's current prefix is ${serverPrefix}`)

        if (prefix.length <= 8) {
            this.client.settings.set(message.guild, 'prefix', prefix)
            return message.channel.send(`I have set the new server prefix to ${prefix}`)
        }
        else return message.channel.send('Please make your new prefix between 1-8 characters.')
    }
}