import { Command } from 'discord-akairo'
import { GuildMember, Message, Role } from 'discord.js'

export default class SetRole extends Command {
    public constructor() {
        super('role', {
            aliases: ['role', 'setrole'],
            category: 'Moderation',
            description: {
                content: 'Gives/takes a role from a user.',
                usage: 'role [@user] [role]',
                examples: ['role @user']
            },
            userPermissions: ['MANAGE_ROLES'],
            clientPermissions: ['MANAGE_ROLES'],
            ratelimit: 3,
            args: [
                {
                    id: 'member',
                    type: 'member'
                },
                {
                    id: 'role',
                    type: 'role'
                }
            ]
        })
    }

    public exec(message: Message, {member, role}: {member: GuildMember, role: Role}): Promise<Message> {
        if (!member) return message.util!.send('Please provide a member to give a role.')
        if (!role) return message.util!.send('Please provide a valid role.')

        if (member.manageable) {
            if (member.roles.cache.find(r => r.id === role.id)) {
                member.roles.remove(role)
                return message.util!.send(`Successfully removed ${role.name} from ${member.user.tag}`)
            } else {
                member.roles.add(role)
                return message.util!.send(`Successfully given ${role.name} to ${member.user.tag}`)
            }
        }
    }
}