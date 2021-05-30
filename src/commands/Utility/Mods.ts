import { Command } from 'discord-akairo'
import { MessageEmbed } from 'discord.js'
import { Message } from 'discord.js'
import moment, { now } from 'moment'

import { Colours } from '../../util/Colours'

export default class Mods extends Command {
    public constructor() {
        super('mods', {
            aliases: ['moderators', 'mods', 'capos'],
            category: 'Utility',
            description: {
                    content: 'Displays the mods & staff in the server.',
                    usage: 'mods',
                    examples: ['mods']
            },
            channel: 'guild',
            ratelimit: 3
        })
    }

    public async exec(message: Message): Promise<Message> {
        const staffRoles = this.client.settings.getArr(message.guild, [
            { key: 'modmail.support-role', defaultValue: ''},
            { key: 'modRole', defaultValue: ''}
        ])
        
        const e = new MessageEmbed()
            .setAuthor(`${message.guild.name} | Staff Roles`, message.guild.iconURL())
            .setColor(Colours.Green)
            .addField('Mod Role', `${staffRoles[1] ? `${message.guild.roles.resolve(staffRoles[1]).name} : ${staffRoles[1]}` : 'None set'}`, false)
            .addField('Support Role', `${staffRoles[0] ? `${message.guild.roles.resolve(staffRoles[0]).name} : ${staffRoles[0]}` : 'None set' }`, false)
            .addField('Mods', `${staffRoles[1] ? 
                `${message.guild.members.cache.filter(m => m.roles.cache.has(staffRoles[1]) || 
                    (m.roles.cache.some(r => r.permissions.has('ADMINISTRATOR')) && 
                    !m.user.bot)).map(gm => gm.user.tag).join(', ')
                }` : 'No users have the staff role.'}`)
            .addField('Supports', `${staffRoles[0] ?
                `${message.guild.members.cache.filter(m => m.roles.cache.has(staffRoles[0]))}`: 'No users have the support role.' }`)
            .setFooter(moment(now()).utcOffset(1).format('YYYY/MM/DD hh:mm:ss a'))

        return await message.util!.send(e)
    }
}