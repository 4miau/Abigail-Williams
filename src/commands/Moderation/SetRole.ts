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
            channel: 'guild',
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

    //@ts-ignore
    userPermissions(message: Message) {
        const modRole = this.client.settings.get(message.guild, 'modRole', '')
        const hasStaffRole = message.member.permissions.has('MANAGE_ROLES', true) || message.member.roles.cache.has(modRole)

        if (!hasStaffRole) return 'Moderator'
        return null
    }

    public exec(message: Message, {member, role}: {member: GuildMember, role: Role}): Promise<Message> {
        if (!member) return message.channel.send('Please provide a member to give a role.')
        if (!role) return message.channel.send('Please provide a valid role.')

        if (!member.manageable) return message.channel.send('Unable to give/take roles from this user.')

        if (member.roles.cache.find(r => r.id === role.id)) {
            member.roles.remove(role)
            return message.channel.send(`Successfully removed ${role.name} from ${member.user.tag}`)
        } else {
            member.roles.add(role)
            return message.channel.send(`Successfully given ${role.name} to ${member.user.tag}`)
        }
    }
}