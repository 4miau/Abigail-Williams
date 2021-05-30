import { Command } from 'discord-akairo'
import { Message, MessageEmbed, Role } from 'discord.js'

import { Colours } from '../../util/Colours'
import { manageAutorole } from '../../util/Functions'

export default class SetAutorole extends Command {
    public constructor() {
        super('setautorole', {
            aliases: ['setautorole', 'autorole'],
            category: 'Configuration',
            description: {
                content: 'Adds/removes a new autorole for the server. Or lists all existing autoroles in the server.',
                usage: 'autorole <add/remove> [role]',
                examples: [''],
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
        const modRole: string = this.client.settings.get(message.guild, 'modRole', '')
        const hasStaffRole = message.member.hasPermission('MANAGE_GUILD', { checkAdmin: true, checkOwner: true}) || message.member.roles.cache.has(modRole)

        if (!hasStaffRole) return 'Moderator'
        return null
    }

    public async exec(message: Message, {type, role}: {type: string, role: Role}): Promise<Message> {
        const autoRoles: { human: string[], bots: string[], all: string[] } = this.client.settings.get(message.guild, 'autoRoles', {})

        if (!type) {
            if (!autoRoles) return message.util!.send('This server has no autoroles.')
            
            const e = new MessageEmbed()
                .setAuthor(`${message.guild.name} | Autoroles`)
                .setColor(Colours.PowderBlue)
                .setDescription('Current autoroles in this server:')
                .addField('Human:', `${(autoRoles.human && autoRoles.human.length > 0 ) ? (autoRoles.human as string[]).join(', ') : 'No human exclusive autoroles.' }`, false)
                .addField('Bots:', `${(autoRoles.bots && autoRoles.bots.length > 0) ? (autoRoles.bots as string[]).join(', ') : 'No bot exclusive autoroles.'}`, false)
                .addField('All:', `${(autoRoles.all && autoRoles.all.length > 0) ? (autoRoles.all as string[]).join(', ') : 'No autoroles for both.'}`, false)
                .setFooter('Powered by the cutie miau.')
        
            return message.util!.send(e)
        }

        if (!role) return message.util!.send('You need to provide a valid role to add/remove from autoroles if you don\'t intend to list them all.')

        const manageType = {
            'add': async () => {
                if (!role.editable) return message.util!.send('I do not have permissions to manage this role, so I can not give them to users.')

                message.channel.send('Who is the target type for this autorole? (humans, bots or all)')
    
                const target = (await message.channel.awaitMessages((msg: Message) => msg.author.id === message.author.id, {
                    max: 1,
                    time: 30000
                })).first().content.toLowerCase()

                if (target !== 'humans' && target !== 'bots' && target !== 'all') return message.util!.send('You need to provide a valid target type.')
                return await manageAutorole(message, role, autoRoles, target, true)
            },
            'remove': async () => {
                message.channel.send('Who is the target type for this autorole? (humans, bots or all)')

                const target = (await message.channel.awaitMessages((msg: Message) => msg.author.id === message.author.id, {
                    max: 1,
                    time: 30000
                })).first().content.toLowerCase()

                if (target !== 'humans' && target !== 'bots' && target !== 'all') return message.util!.send('You need to provide a valid target type.')
                return await manageAutorole(message, role, autoRoles, target, false)
            }
        }

        await manageType[type].call()
    }
}