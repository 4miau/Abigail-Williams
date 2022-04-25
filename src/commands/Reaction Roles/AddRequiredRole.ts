import { Command } from 'discord-akairo'
import { Message, Role } from 'discord.js'

export default class AddRequiredRole extends Command {
    public constructor() {
        super('addrequiredrole', {
            aliases: ['addrequiredrole'],
            category: 'Reaction Roles',
            description: {
                content: 'Adds a required role in a reaction group.',
                usage: 'addrequiredrole [role]',
                examples: ['addrequiredrole member'],
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

    public async exec(message: Message, {role}: {role: Role}): Promise<Message> {
        if (!role) return message.channel.send('You need to provide a role.')

        const roleGroups: RoleGroup[] = this.client.settings.get(message.guild, 'role-groups', [])
        if (roleGroups.arrayEmpty()) return message.channel.send('There are no reaction role groups, consider making a reaction role group first.')

        const group = await this.automateAwaitMessage('Enter the name of the role group.', message).then(g => g.replace(' ', '-'))

        if (!group || !roleGroups.find(rg => rg.groupName.caseCompare(group))) return message.channel.send('Failed finding this group, please try again.')
        else {
            const groupIndex = roleGroups.findIndex(rg => rg.groupName.caseCompare(group))
            roleGroups[groupIndex].rolesRequired.push(role.id)
            this.client.settings.set(message.guild, 'role-groups', roleGroups)
            return message.channel.send('Successfully added new required role to this group.')
        }
    }

    private async automateAwaitMessage(content: string, m: Message) {
        const filter = (msg: Message) => msg.author.id === m.author.id

        m.channel.send(content)
        return (await m.channel.awaitMessages({ filter: filter, max: 1, time: 30000 })).first().content
    }
}