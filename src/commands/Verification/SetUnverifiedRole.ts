import { Command } from 'discord-akairo'
import { Message, Role } from 'discord.js'

export default class SetUnverifiedRole extends Command {
    public constructor() {
        super('setunverifiedrole', {
            aliases: ['setunverifiedrole'],
            category: 'Verification',
            description: {
                content: 'Optional autorole to give when users join and remove from member\'s who verify. Leaving this empty will reset the unverified role.',
                usage: 'setunverifiedrole <role>',
                examples: ['serunverifiedrole unverified'],
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
        const hasStaffRole = message.member.permissions.has('MANAGE_ROLES', true) || message.member.roles.cache.has(modRole)

        if (!hasStaffRole) return 'Server administrator or staff role'
        return null
    }

    public exec(message: Message, {role}: {role: Role}): Promise<Message> {
        if (role) {
            this.client.settings.set(message.guild, 'unverified-role', role.id)
            return message.channel.send(`Successfully set ${role.name} as the new unverified role.`)
        }
        else {
            this.client.settings.delete(message.guild, 'unverified-role')
            return message.channel.send('I have successfully removed the guild\'s unverified role.')
        }
    }
}