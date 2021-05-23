import { Command } from 'discord-akairo'
import { Message, Role } from 'discord.js'

export default class SetStaffRole extends Command {
    public constructor() {
        super('setstaffrole', {
            aliases: ['setstaffrole', 'setmodrole', 'set-mod', 'set-staff'],
            category: 'Configuration',
            description: {
                content: 'Sets a new staff role to allow usage of staff commands.',
                usage: 'setstaffrole [role]',
                examples: ['setstaffrole Staff'],
            },
            channel: 'guild',
            userPermissions: ['MANAGE_GUILD'],
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
        if (!role) return message.util!.send('You need to provide a valid role to set as the new staff role.')

        this.client.settings.set(message.guild, 'modRole', role.id)
        return message.util!.send('New modrole has been set for the server.') 
    }
}