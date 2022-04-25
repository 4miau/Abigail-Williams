import { Command } from 'discord-akairo'
import { Message, Role } from 'discord.js'

export default class AddReactRole extends Command {
    public constructor() {
        super('addreactrole', {
            aliases: ['addreactrole'],
            category: 'Reaction Roles',
            description: {
                content: 'Adds a new react role to an existing react group. Speech marks are necessary if the group name is not 1 word.',
                usage: 'addreactrole ["groupName"] [role]',
                examples: ['addreactrole genders male', 'addreactrole "Colours 1" red', 'addreactrole "Colours 1" 1234567890'],
            },
            channel: 'guild',
            ratelimit: 3,
            args: [
                {
                    id: 'groupName',
                    type: 'string',
                    match: 'phrase'
                },
                {
                    id: 'role',
                    type: 'role',
                    match: 'rest'
                }
            ]
        })
    }

    public exec(message: Message, {groupName, role}: {groupName: string, role: Role}): Promise<Message> {
        if (!groupName) return message.channel.send('You must provide a react role group name.')
        if (!role) return message.channel.send('You must provide a valid role to add.')

        groupName = groupName.replace(' ', '-')

        const reactGroups: RoleGroup[] = this.client.settings.get(message.guild, 'role-groups', [])

        if (reactGroups.some(rg => rg.groupName.caseCompare(groupName))) {
            const groupIndex = reactGroups.findIndex(rg => rg.groupName.caseCompare(groupName))

            if (reactGroups[groupIndex].roles.length >= 8) return message.channel.send('Unable to add a new role, group has reached max size.')
            if (reactGroups[groupIndex].roles.some(r => r === role.id)) return message.channel.send('This react role is already inside this group.')
            
            reactGroups[groupIndex].roles.push(role.id)
            this.client.settings.set(message.guild, 'role-groups', reactGroups)
            return message.channel.send('Successfully added a new react role to this group.')
        }
        else return message.channel.send('Unable to find react role group.')
    }
}