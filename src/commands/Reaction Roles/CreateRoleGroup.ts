import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

export default class CreateRoleGroup extends Command {
    public constructor() {
        super('createrolegroup', {
            aliases: ['createrolegroup', 'createrg', 'newrolegroup'],
            category: 'Reaction Roles',
            description: {
                content: 'Creates a new role group with a group name.',
                usage: 'createrolegroup [name]',
                examples: ['creategroupname genders'],
            },
            channel: 'guild',
            ratelimit: 3,
            args: [
                {
                    id: 'name',
                    type: 'string',
                    match: 'restContent'
                }
            ]
        })
    }

    public exec(message: Message, {name}: {name: string}): Promise<Message> {
        if (!name) return message.channel.send('Provide a group name for the group name.')
        const roleGroups: RoleGroup[] = this.client.settings.get(message.guild, 'reaction.role-groups', [])
        const prefix = this.client.settings.get(message.guild, 'prefix', 'a.')
        const hasPremium: boolean = this.client.settings.get(message.guild, 'has-premium', false)

        if (roleGroups.some(rg => rg.groupName.caseCompare(name))) return message.channel.send('There is an existing group with this name.')
        else if (!hasPremium && roleGroups.length >= 3) return message.channel.send('You have reached the maximum number of role groups as a non-premium guild.')
        else if (hasPremium && roleGroups.length >= 10) return message.channel.send('You have reached the maximum number of role groups.')
        else if (name.split(' ').length > 2 || name.length > 16)
            return message.channel.send('Unable to create new role group. Must be below 16 characters & no more than 3 words.')
        else {
            roleGroups.push({ groupName: name, roles: [], singleLock: false, rolesRequired: [], ignoreRoles: [], messages: [] })
            this.client.settings.set(message.guild, 'reaction.role-groups', roleGroups)
            return message.channel.send(
                `New role group created. ${roleGroups.arrayEmpty() ? `Use \`${prefix}managerolegroup\` for information on how to move on next.` : '' }`
            )
        }
    }
}