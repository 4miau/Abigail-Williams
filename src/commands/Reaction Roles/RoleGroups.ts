import { Command } from 'discord-akairo'
import { Message, MessageEmbed } from 'discord.js'
import moment from 'moment'

export default class RoleGroups extends Command {
    public constructor() {
        super('rolegroups', {
            aliases: ['rolegroups'],
            category: 'Reaction Roles',
            description: {
                content: 'Gets a list of the reaction role groups in this guild.',
                usage: 'rolegroups <group>',
                examples: ['rolegroups', 'rolegroups genders'],
            },
            channel: 'guild',
            ratelimit: 3,
            args: [
                {
                    id: 'group',
                    type: 'string',
                    match: 'rest'
                }
            ]
        })
    }

    public exec(message: Message, {group}: {group: string}): Promise<Message> {
        const roleGroups: RoleGroup[] = this.client.settings.get(message.guild, 'reaction.role-groups', [])
        if (group && !roleGroups.find(rg => rg.groupName.caseCompare(group))) group = null

        const e = new MessageEmbed()
            .setFooter(`Command ran by ${message.author.tag} | ${moment(Date.now()).format('YYYY/MM/DD HH:mm:ss')}`)

        if (!group) {
            e
            .setAuthor('Guild Role Groups', message.guild.iconURL({ dynamic: true, format: 'png' }))
            .setDescription(
                !roleGroups.arrayEmpty() ? 
                    roleGroups.map(rg => `\`${rg.groupName}\` (${rg.roles.length} roles)`).join('\n') : 
                    '*There are currently no role groups in this guild.*'
            )
        } else {
            const roleGroup: RoleGroup = roleGroups.find(rg => rg.groupName.caseCompare(group))

            e
            .setAuthor(`Role Group: ${roleGroup.groupName}`, message.guild.iconURL({ dynamic: true, format: 'png' }))
            .addFields([
                { name: 'No. of react roles', value: String(roleGroup.roles.length), inline: true },
                { name: 'No. of required roles', value: String(roleGroup.rolesRequired.length),inline: true },
                { name: 'No. of ignored roles', value: String(roleGroup.ignoreRoles.length), inline: true },
                { name: 'is singlelock?', value: String(roleGroup.singleLock) }
            ])
            .addField(
                'Roles', 
                `${roleGroup.roles.arrayEmpty() ? 'No roles' : `${roleGroup.roles.map(r => {
                    const role = message.guild.roles.resolve(r)
                    if (!role) return
                    return `\`${role.name}\`: \`(${role.id})\``
                }).join('\n')}`}`
            )
        }

        return message.channel.send({ embeds: [e] })
    }
}