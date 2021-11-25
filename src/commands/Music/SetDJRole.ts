import { Command } from 'discord-akairo'
import { Message, Role } from 'discord.js'

export default class SetDJRole extends Command {
    public constructor() {
        super('setdjrole', {
            aliases: ['setdjrole', 'djrole', 'setdj'],
            category: 'Music',
            description: {
                content: 'Sets a DJ Role in the server (leave blank to remove current DJ role)',
                usage: 'setdjrole <role>',
                examples: ['setdjrole dj'],
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
        const modRole: string = this.client.settings.get(message.guild, 'modRole', '')
        const hasStaffRole = message.member.permissions.has('MANAGE_GUILD', true) || message.member.roles.cache.has(modRole)

        if (!hasStaffRole) return 'Moderator'
        return null
    }

    public exec(message: Message, {role}: {role: Role}): Promise<Message> {
        if (!role) {
            this.client.settings.delete(message.guild, 'djRole')
            return message.channel.send('Removed the server\'s DJ role from my database, if any.')
        }

        this.client.settings.set(message.guild, 'djRole', role.id)
        return message.channel.send('New DJ role has been set for the server.')
    }
}