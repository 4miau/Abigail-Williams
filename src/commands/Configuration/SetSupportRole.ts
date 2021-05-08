import { Command } from 'discord-akairo'
import { Message, RoleResolvable, Role } from 'discord.js'

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
            userPermissions: ['MANAGE_GUILD'],
            clientPermissions: ['MANAGE_ROLES'],
            ratelimit: 3,
            args: [
                {
                    id: 'role',
                    type: 'role'
                }
            ]
        })
    }

    public exec(message: Message, {role}: {role: Role}): Promise<Message> {
        const currRole: Role = message.guild.roles.resolve(this.client.settings.get(message.guild, 'modmail.support-role', ''))

        if (!role) {
            if (currRole) return message.util!.send(`The server's current support role is: ${currRole.name}`)
            return message.util!.send('This server currently does not have a support role.')
        }

        if (role) {
            this.client.settings.set(message.guild, 'modmail.support-role', role.id)
            return message.util!.send('New support role has been set.')
        }

        return message.util!.send('Please provide a valid role to set as the new support role.')
    }
}