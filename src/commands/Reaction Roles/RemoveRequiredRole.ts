import { Command } from 'discord-akairo'
import { Message, Role } from 'discord.js'

export default class RemoveRequiredRole extends Command {
    public constructor() {
        super('removerequiredrole', {
            aliases: ['removerequiredrole'],
            category: 'Reaction Roles',
            description: {
                content: 'Removes a required role from a reaction group.',
                usage: 'removerequiredrole [role]',
                examples: ['removerequiredrole muted'],
            },
            channel: 'guild',
            ratelimit: 3,
            args: [
                {
                    id: 'reqRole',
                    type: 'role',
                    match: 'rest'
                }
            ]
        })
    }

    public async exec(message: Message, {reqRole}: {reqRole: Role}): Promise<Message> {
        if (!reqRole) return message.channel.send('You need to provide a role.')

        const roleGroups: RoleGroup[] = this.client.settings.get(message.guild, 'reaction.role-groups', [])
        if (roleGroups.arrayEmpty()) return message.channel.send('There are no reaction role groups, consider making a reaction role group first.')

        const group = await this.automateAwaitMessage('Enter the name of the role group.', message)

        if (!group || !roleGroups.find(rg => rg.groupName.caseCompare(group))) return message.channel.send('Failed finding this group, please try again.')
        else {
            const groupIndex = roleGroups.findIndex(rg => rg.groupName.caseCompare(group))

            if (roleGroups[groupIndex].rolesRequired.arrayEmpty()) return message.channel.send('There are no required roles in the group.')
            else if (!roleGroups[groupIndex].rolesRequired.find(r => r === reqRole.id)) return message.channel.send('Unable to find this role.')
            else {
                roleGroups[groupIndex].rolesRequired = roleGroups[groupIndex].rolesRequired.filter(r => r !== reqRole.id)
                this.client.settings.set(message.guild, 'reaction.role-groups', roleGroups)
                return message.channel.send('Successfully removed this role from the required roles list.')
            }
        }
    }

    private async automateAwaitMessage(content: string, m: Message) {
        const filter = (msg: Message) => msg.author.id === m.author.id

        m.channel.send(content)
        return (await m.channel.awaitMessages({ filter: filter, max: 1, time: 60000 })).first().content
    }
}