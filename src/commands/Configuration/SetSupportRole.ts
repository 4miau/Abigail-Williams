import { Command } from 'discord-akairo'
import { Message, Role } from 'discord.js'

export default class SetSupportRole extends Command {
    public constructor() {
        super('setsupportrole', {
            aliases: ['setsupportrole', 'supportrole', 'srole'],
            category: 'Configuration',
            description: {
                    content: 'Sets/gets the support role',
                    usage: 'setsupportrole [role]',
                    examples: ['supportrole support']
            },
            channel: 'guild',
            ratelimit: 3,
            args: [
                {
                    id: 'role',
                    type: 'role'
                }
            ]
        })
    }

    //@ts-ignore
    userPermissions(message: Message) {
        const modRole = this.client.settings.get(message.guild, 'modRole', '')
        const hasStaffRole = message.member.permissions.has('MANAGE_GUILD', true) || message.member.roles.cache.has(modRole)

        if (!hasStaffRole) return 'Moderator'
        return null
    }

    public exec(message: Message, {role}: {role: Role}): Promise<Message> {
        const currRole: Role = message.guild.roles.resolve(this.client.settings.get(message.guild, 'modmail.support-role', ''))

        if (!role) {
            if (currRole) return message.channel.send(`The server's current support role is: ${currRole.name}`)
            return message.channel.send('This server currently does not have a support role.')
        }

        if (role) {
            this.client.settings.set(message.guild, 'modmail.support-role', role.id)
            return message.channel.send('New support role has been set.')
        }

        return message.channel.send('Please provide a valid role to set as the new support role.')
    }
}