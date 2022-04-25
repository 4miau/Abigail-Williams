import { Message, Role } from 'discord.js'

import Abby from '../../client/Abby'
import Service from '../../modules/Service'

export default class ManageAutoRole extends Service {
    public constructor() {
        super('manageautorole', {
            category: 'GuildAsync'
        })
    }

    async exec(message: Message, role: Role, target: AutoroleTags, add: boolean): Promise<Message> {
        const autoRoles: { humans: string[], bots: string[], all: string[] } = this.client.settings.get(message.guild, 'auto-roles', { humans: [], bots: [], all: [] })
        
        if (add) {
            target = (<string>target === 'human') ? 'humans' : target
            target = (<string>target === 'bot') ? 'bots' : target
    
            if (autoRoles[target].arrayEmpty()) {
                autoRoles[target] = [role.id]
                await this.client.settings.set(message.guild, 'auto-roles', autoRoles)
                return message.channel.send(`Successfully added new autorole for ${target}`)
            }
            else if (autoRoles[target] && autoRoles[target].includes(role.id)) return message.channel.send(`This role is already on the autorole list for ${target}`)
            else {
                autoRoles[target].push(role.id)
                await this.client.settings.set(message.guild, 'auto-roles', autoRoles)
                return message.channel.send(`Successfully added new autorole for ${target}`)
            }
        }
        else {
            if (autoRoles[target].arrayEmpty()) return message.channel.send(`There are no autoroles for ${target} exclusively.`)
            else if (!autoRoles[target].includes(role.id)) return message.channel.send(`This role is not on the ${target} autorole list`)
    
            autoRoles[target] = autoRoles[target].filter(ar => ar !== role.id)
            await this.client.settings.set(message.guild, 'auto-roles', autoRoles)
            return message.channel.send(`Successfully removed role from the ${target} autorole list.`)
        }
    }
}