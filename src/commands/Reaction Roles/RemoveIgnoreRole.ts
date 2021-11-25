import { Command } from 'discord-akairo'
import { Message, Role } from 'discord.js'

export default class RemoveIgnoreRole extends Command {
    public constructor() {
        super('removeignorerole', {
            aliases: ['removeignorerole'],
            category: 'Reaction Roles',
            description: {
                content: 'Removes an ignored role from a reaction group.',
                usage: 'removeignorerole [role]',
                examples: ['removeignorerole muted'],
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

        const roleGroups: RoleGroup[] = this.client.settings.get(message.guild, 'reaction.role-groups', [])
        if (roleGroups.arrayEmpty()) return message.channel.send('There are no reaction role groups, consider making a reaction role group first.')

        const group = await this.automateAwaitMessage('Enter the name of the role group', message)

        if (!group || !roleGroups.find(rg => rg.groupName.caseCompare(group))) return message.channel.send('Failed finding this group, please try again.')
        else {
            const groupIndex = roleGroups.findIndex(rg => rg.groupName.caseCompare(group))

            if (roleGroups[groupIndex].ignoreRoles.arrayEmpty()) return message.channel.send('There are no ignored roles in the group.')
            else if (!roleGroups[groupIndex].ignoreRoles.find(r => r === role.id)) return message.channel.send('Unable to find this role in the group.')
            else {
                roleGroups[groupIndex].ignoreRoles = roleGroups[groupIndex].ignoreRoles.filter(r => r !== role.id)
                this.client.settings.set(message.guild, 'reaction.role-groups', roleGroups)
                return message.channel.send('Successfully removed this ignore role from the group.')
            }
        }
    }

    private async automateAwaitMessage(content: string, m: Message) {
        const filter = (msg: Message) => msg.author.id === m.author.id

        m.channel.send(content)
        return (await m.channel.awaitMessages({ filter: filter, max: 1, time: 30000 })).first().content
    }
}