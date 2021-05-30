import { Listener } from 'discord-akairo'
import { MessageEmbed, Role, TextChannel } from 'discord.js'

import { Colours } from '../../util/Colours'

export default class RoleCreate extends Listener {
    public constructor() {
        super('rolecreate', {
            emitter: 'client',
            event: 'roleCreate',
            category: 'client'
        })
    }

    public async exec(role: Role) {
        const gtc: TextChannel = this.client.channels.cache.get('842906441458384926') as TextChannel
        const roleLogChannel = role.guild.channels.resolve(this.client.settings.get(role.guild, 'logs.role-logs', '')) as TextChannel

        if (roleLogChannel) {
            const e = new MessageEmbed()
                .setAuthor(`New Role Created | ${role.guild.name}`)
                .setColor(Colours.Green)
                .addField('**New role:**', role.name)
                .addField('Role Permissions:', `${role.permissions ? role.permissions.toArray(true).join('\n') : 'This role has no permissions.'}`)
            
            roleLogChannel.send(e)


            e.setDescription(`**Server:** ${role.guild.name} (${role.guild.id})`)
            gtc.send(e)
        }
    }
}