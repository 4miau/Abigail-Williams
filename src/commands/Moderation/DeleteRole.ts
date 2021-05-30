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
            userPermissions: ['MANAGE_ROLES'],
            ratelimit: 3,
            args: [
                {
                    id: 'role',
                    type: 'role'
                }
            ]
        })
    }

    public async exec(message: Message, {role}: {role: Role}): Promise<Message> {
        if (!role) return message.util!.send('Please provide a valid role.')

        try {
            await message.guild.roles.fetch(role.id)
                .then(r => r.delete())
            return message.util!.send(`Role has been deleted successfully.`)
        } catch (err) {
            return message.util!.send('Failed to delete the role, please make sure my role is above the role you are trying to remove.')
        }
    }
}

//TODO: Check if role is manageable, then you can leave out the try-catch