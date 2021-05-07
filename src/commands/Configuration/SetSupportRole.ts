import { Command } from 'discord-akairo'
import { Message, RoleResolvable, Role } from 'discord.js'

export default class SetSupportRole extends Command {
    public constructor() {
        super('setsupportrole', {
            aliases: ['setsupportrole', 'supportrole', 'srole'],
            category: 'Configuration',
            description: [
                {
                    content: 'Sets/gets the support role',
                    usage: 'setsupportrole [role]',
                    examples: ['supportrole support']
                }
            ],
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

    public exec(message: Message, {role}: {role: RoleResolvable}): Promise<Message> {
        const roleResolved: Role = message.guild.roles.resolve(this.client.settings.get(message.guild, 'modmail.support-role', ''))

        if (!role) {
            if (roleResolved) return message.util!.send(`The server's current support role is: @${roleResolved.name}`)
            return message.util!.send('This server currently does not have a support role.')
        }

        if (roleResolved) {
            this.client.settings.set(message.guild, 'modmail.support-role', roleResolved.id)
            return message.util!.send('New support role has been set.')
        }

        return message.util!.send('Please provide a valid role to set as the new support role.')
    }
}