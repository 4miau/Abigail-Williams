import { Listener } from 'discord-akairo'
import { MessageEmbed, Role, TextChannel } from 'discord.js'

import { Colours } from '../../util/Colours'

export default class RoleUpdated extends Listener {
    public constructor() {
        super('roleupdated', {
            emitter: 'client',
            event: 'roleUpdate',
            category: 'client'
        })
    }

    public async exec(oldRole: Role, newRole: Role) {
        const gtc: TextChannel = this.client.channels.cache.get('842906441458384926') as TextChannel
        const roleLogChannel = newRole.guild.channels.resolve(this.client.settings.get(newRole.guild, 'logs.role-logs', '')) as TextChannel

        if (roleLogChannel) {
            const e = new MessageEmbed()
                .setAuthor(`Role Updated | ${newRole.guild.name}`)
                .setColor(Colours.Orange)
            
            ;(newRole.name !== oldRole.name ?
            () => {
                e.addField('Old role name:', `${oldRole.name}`, false)
                e.addField('New role name:', `${newRole.name}`, true)
            } :
            void 0)()

            ;(newRole.mentionable !== oldRole.mentionable ?
            () => {
                e.addField('Old role mentionable:', `${oldRole.mentionable}`, false)
                e.addField('New role mentionable:', `${newRole.mentionable}`, true)
            } :
            void 0)()

            ;(newRole.color !== oldRole.color ?
            () => {
                e.addField('Old role colour:', `${oldRole.hexColor}`, false)
                e.addField('New role colour:', `${newRole.hexColor}`, true)
            } :
            void 0)()

            ;(newRole.hoist !== oldRole.hoist ?
            () => {
                e.addField('Old role hoisted', `${oldRole.hoist}`, false)
                e.addField('New role hoisted', `${newRole.hoist}`, true)
            } :
            void 0)()

            ;(newRole.permissions.toArray(true) !== oldRole.permissions.toArray(true) ?
            () => {
                e.addField('Old role permissions', `${oldRole.permissions.toArray().join(', ')}`)
                e.addField('New role permissions', `${newRole.permissions.toArray().join(', ')}`)
            }:
            void 0)()

            roleLogChannel.send(e)

            e.setDescription(`**Server:** ${newRole.guild.name} (${newRole.guild.id})`)
            gtc.send(e) 
        }
    }
}