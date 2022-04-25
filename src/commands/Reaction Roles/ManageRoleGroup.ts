import { Command, Argument } from 'discord-akairo'
import { Message, MessageEmbed } from 'discord.js'
import moment from 'moment'

import { isReactOption } from '../../typings/Types'

export default class ManageRoleGroup extends Command {
    public constructor() {
        super('managerolegroup', {
            aliases: ['managerolegroup', 'managerp'],
            category: 'Reaction Roles',
            description: {
                content: 'Allows you to manage settings for reaction groups (providing no arguments will explain options)',
                usage: 'managerolegroup <groupName> [option] <value>',
                examples: ['managerolegroup', 'managerolegroup genders singlelock true', 'managerolegroup "Colours 1" singlelock'],
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
                    id: 'option',
                    type: 'string',
                    match: 'phrase'
                },
                {
                    id: 'value',
                    type: Argument.union('boolean', 'string'),
                    match: 'rest'
                }
            ]
        })
    }

    public exec(message: Message, {groupName, option, value}): Promise<Message> {
        const roleGroups: RoleGroup[] = this.client.settings.get(message.guild, 'role-groups', [])
        groupName = groupName.replace(' ', '-')

        if (roleGroups.arrayEmpty()) return message.channel.send('You should create a role group before considering managing a role group.')
        else if (!groupName) {
            message.delete()
            const e = new MessageEmbed()
                .setAuthor('Manage Role Groups', message.guild.iconURL({ dynamic: true, format: 'png' }))
                .addFields([
                    { 
                        name: 'Next Steps', 
                        value: 'As you have role groups, you should start with adding **react roles** to these groups using the `addreactrole` command. ' + 
                        'You may optionally wish to add **required roles** `addrequiredrole` which are roles that are required in order to access a react role. ' +
                        'You can also add **ignored roles** `addignoredrole` which block users from accessing a react role if they contain an ignored role.' 
                    },
                    { 
                        name: 'Manage Group Options', 
                        value: '**Singlelock**: *true*/*false* - Determines if a user may only have 1 react role at a time, ' +
                        'trying to receive another will remove their currently existing react role.' 
                    }
                ])
                .setFooter(`Command ran by ${message.author.tag} | ${moment(Date.now()).format('YYYY/MM/DD HH:mm:ss')}`)

            return message.channel.send({ embeds: [e] })
        }
        else {
            if (!option || !isReactOption(option.toLocaleUpperCase())) return message.channel.send('You did not provide a valid option.')
            else if (!value) return message.channel.send('You must provide a value for this option.')
            else {
                const manageReactRole = this.client.serviceHandler.modules.get('managereactrole')
                const result = manageReactRole.exec(option.toLocaleUpperCase(), value.toLocaleLowerCase(), groupName, message)
                return message.channel.send(result.includes('Error') ? `**Error occurred:**\n${result.replace('Error: ', '')}` : result)
            }
        }
    }
}