import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

export default class DeleteRoleGroup extends Command {
    public constructor() {
        super('deleterolegroup', {
            aliases: ['deleterolegroup', 'deleterg'],
            category: 'Reaction Roles',
            description: {
                content: 'Deletes an existing server role group.',
                usage: 'deleterolegroup [name]',
                examples: ['deleterolegroup genders'],
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
        if (!name) return message.channel.send('You need to provide a name to search for.')

        const roleGroups: RoleGroup[] = this.client.settings.get(message.guild, 'reaction.role-groups', [])

        if (roleGroups.arrayEmpty() || !roleGroups.some(rg => rg.groupName.caseCompare(name))) return message.channel.send('Unable to find a group with this name.')
        else {
            roleGroups.length === 1 ? 
                this.client.settings.delete(message.guild, 'reaction.role-groups') : 
                this.client.settings.set(message.guild, 'reaction.role-groups', roleGroups.filter(rg => !rg.groupName.caseCompare(name)))
            return message.channel.send('Role group deleted successfully.')
        }
    }
}