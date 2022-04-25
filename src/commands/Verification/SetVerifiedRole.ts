import { Command } from 'discord-akairo'
import { Message, Role } from 'discord.js'

export default class SetVerifiedRole extends Command {
    public constructor() {
        super('setverifiedrole', {
            aliases: ['setverifiedrole'],
            category: 'Verification',
            description: {
                content: 'Sets the role to give to members who successfully verify. No input or an invalid value will reset the role.',
                usage: 'setverifiedrole <role>',
                examples: ['setverifiedrole verified'],
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
            this.client.settings.set(message.guild, 'verified-role', role.id)
            return message.channel.send(`Successfully set ${role.name} as the new verified role.`)
        }
        else {
            this.client.settings.delete(message.guild, 'verified-role')
            return message.channel.send('I have successfully removed the guild\'s verified role.')
        }
    }
}