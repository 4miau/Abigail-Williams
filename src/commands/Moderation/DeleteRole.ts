import { Command } from 'discord-akairo'
import { Message, Role } from 'discord.js'

export default class DeleteRole extends Command {
    public constructor() {
        super('deleterole', {
            aliases: ['deleterole'],
            category: 'Moderation',
            description: {
                content: 'Deletes a role',
                usage: 'deleterole [rolename]',
                examples: ['deleterole members'],
            },
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
        const hasStaffRole = message.member.permissions.has('MANAGE_ROLES', true) || message.member.roles.cache.has(modRole)

        if (!hasStaffRole) return 'Moderator'
        return null
    }

    public async exec(message: Message, {role}: {role: Role}): Promise<Message> {
        if (!role) return message.channel.send('Please provide a valid role.')

        try {
            await message.guild.roles.fetch(role.id).then(r => r.delete())
            return message.channel.send('Role has been deleted successfully.')
        } catch {
            return message.channel.send('Failed to delete the role, please make sure my role is above the role you are trying to remove.')
        }
    }
}