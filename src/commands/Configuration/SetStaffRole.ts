import { Command } from 'discord-akairo'
import { Message, Role } from 'discord.js'

export default class SetStaffRole extends Command {
    public constructor() {
        super('setstaffrole', {
            aliases: ['setstaffrole', 'setmodrole', 'modrole', 'set-mod', 'set-staff'],
            category: 'Configuration',
            description: {
                content: 'Sets a new staff role to allow usage of staff commands. (Leave blank to remove server staff role)',
                usage: 'setstaffrole [role]',
                examples: ['setstaffrole Staff'],
            },
            channel: 'guild',
            ratelimit: 3,
            args: [
                {
                    id: 'role',
                    type: 'role',
                    match: 'rest'
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
        if (!role) {
            this.client.settings.delete(message.guild, 'modRole')
            return message.channel.send('I have removed the staff role in this server if any.')
        }

        this.client.settings.set(message.guild, 'modRole', role.id)
        return message.channel.send('New modrole has been set for the server.') 
    }
}