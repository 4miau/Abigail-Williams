import { Command } from 'discord-akairo'
import { Message, MessageEmbed, Role } from 'discord.js'

import { Colours } from '../../util/Colours'
import { manageAutorole } from '../../util/functions/guild'

export default class SetAutorole extends Command {
    public constructor() {
        super('setautorole', {
            aliases: ['setautorole', 'autorole'],
            category: 'Configuration',
            description: {
                content: 'Adds/removes a new autorole for the server. Or lists all existing autoroles in the server.',
                usage: 'autorole <add/remove> [role]',
                examples: ['autorole add citizen', 'autorole remove vip', 'autorole'],
            },
            channel: 'guild',
            ratelimit: 3,
            args: [
                {
                     id: 'type',
                     type: (_: Message, str: string): string => {
                         if (!str) return null
                         if (str.toLowerCase() === 'add' || str.toLowerCase() === 'remove') return str.toLowerCase()
                         return null
                     }
                },
                {
                    id: 'role',
                    type: 'role',
                    match: 'rest'
                }
            ]
        })
    }

    //@ts-ignore
    userPermissions(message: Message) {
        const modRole = this.client.settings.get(message.guild, 'modRole', '')
        const hasStaffRole = message.member.permissions.has('MANAGE_GUILD', true) || message.member.roles.cache.has(modRole)

        if (!hasStaffRole) return 'Moderator'
        return null
    }

    public async exec(message: Message, {type, role}: {type: string, role: Role}): Promise<Message> {
        if (!type) {
            const autoRoles: { humans: string[], bots: string[], all: string[] }  = this.client.settings.get(message.guild, 'autoRoles', {})

            if (autoRoles.isObjectEmpty()) return message.channel.send('This server has no autoroles.')

            const e = new MessageEmbed()
                .setAuthor(`${message.guild.name} | Autoroles`)
                .setColor(Colours.PowderBlue)
                .setDescription('Current autoroles in this server:')
                .addField(
                    'Human:',
                    `${(autoRoles.humans && autoRoles.humans.length > 0 ) ? (autoRoles.humans).join(', ') : 'No human exclusive autoroles.' }`,
                    false
                )
                .addField(
                    'Bots:',
                    `${(autoRoles.bots && autoRoles.bots.length > 0) ? (autoRoles.bots).join(', ') : 'No bot exclusive autoroles.'}`,
                    false
                )
                .addField(
                    'All:',
                    `${(autoRoles.all && autoRoles.all.length > 0) ? (autoRoles.all).join(', ') : 'No autoroles for both.'}`, 
                    false
                )
                .setFooter('Powered by the cutie miau.')
            
            return message.channel.send({ embeds: [e] }) 
        }

        if (!role) return message.channel.send('You need to provide a valid role to add/remove from autoroles if you don\'t intend to list them all.')
        if (!role.editable) return message.channel.send('I do not have permissions to manage this role, so I can not give them to users.')

        message.channel.send('Who is the target type for this autorole? (humans, bots or all)')

        const filter = (msg: Message) => msg.author.id === message.author.id
        const target = (await message.channel.awaitMessages({ filter: filter, max: 1, time: 30000 })).first().content.toLowerCase() as AutoroleTags

        if (!target.caseCompare('humans', 'bots', 'all')) return message.channel.send('You need to provide a valid target type.')
        return manageAutorole(message, role, target, type === 'add' ? true : false)
    }
}