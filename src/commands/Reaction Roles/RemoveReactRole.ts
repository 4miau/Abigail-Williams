import { Command } from 'discord-akairo'
import { Message, Role } from 'discord.js'

export default class RemoveReactRole extends Command {
    public constructor() {
        super('removereactrole', {
            aliases: ['removereactrole'],
            category: 'Reaction Roles',
            description: {
                content: 'Removes a react role from a group.',
                usage: 'removereactrole ["group"] [role]',
                examples: ['removereactrole age 21+', 'removereactrole "age" 21+'],
            },
            channel: 'guild',
            ratelimit: 3,
            args: [
                {
                    id: 'group',
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

    public exec(message: Message, {group, role}: {group: string, role: Role}): Promise<Message> {
        if (!group || !role) return message.channel.send('You must provide a group and a role in order to remove a react role.')

        const reactGroups: RoleGroup[] = this.client.settings.get(message.guild, 'reaction.role-groups', [])

        if (reactGroups.arrayEmpty()) return message.channel.send('There are currently no reaction groups so you can not remove any reactions.')
        else {
            const groupIndex = reactGroups.findIndex(rg => rg.groupName.caseCompare(group))
            if (reactGroups[groupIndex].roles.arrayEmpty()) return message.channel.send('There are no roles in this group.')
            else if (reactGroups[groupIndex].roles.find(r => r === role.id)) {
                reactGroups[groupIndex].roles = reactGroups[groupIndex].roles.filter(r => r !== role.id)
                this.client.settings.set(message.guild, 'reaction.role-groups', reactGroups)
                return message.channel.send('Successfully removed this role from the group.')
            }
            else return message.channel.send('Unable to find this role in this group, please try again.')
        }
    }
}