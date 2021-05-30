import { Listener } from 'discord-akairo'
import { MessageEmbed, Role, TextChannel } from 'discord.js'

import { Colours } from '../../util/Colours'

export default class RoleDelete extends Listener {
    public constructor() {
        super('roledelete', {
            emitter: 'client',
            event: 'roledelete',
            category: 'client'
        })
    }

    public async exec(role: Role) {
        const gtc: TextChannel = this.client.channels.cache.get('842906441458384926') as TextChannel
        const roleLogChannel = role.guild.channels.resolve(this.client.settings.get(role.guild, 'logs.role-logs', '')) as TextChannel

        if (roleLogChannel) {
            const e = new MessageEmbed()
                .setAuthor(`Role Deleted | ${role.guild.name}`)
                .addField('**Role removed:**', role.name)
                .setColor(Colours.Crimson)

            roleLogChannel.send(e)

            e.setDescription(`**Server:** ${role.guild.name} (${role.guild.id})`)
            gtc.send(e)
        }        
    }
}