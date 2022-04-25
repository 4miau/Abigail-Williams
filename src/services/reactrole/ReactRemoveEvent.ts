import { MessageReaction, User } from 'discord.js'

import Abby from '../../client/Abby'
import Service from '../../modules/Service'

export default class ReactRemoveEvent extends Service {
    public constructor() {
        super('reactremoveevent', {
            category: 'Reaction Role'
        })
    }

    async exec(reaction: MessageReaction, user: User): Promise<boolean> {
        const guild = reaction.message.guild
        const member = guild.members.resolve(user.id)
        const roleGroups: RoleGroup[] = this.client.settings.get(reaction.message.guild, 'role-groups', [])

        if (roleGroups.arrayEmpty()) return false //|| !roleGroups.find(rg => rg.messages.some(m => m.message === reaction.message.id))

        this.client.logger.log('INFO', String(reaction.emoji.identifier))

        for (const [_, roleGroup] of roleGroups.entries()) {
            if (!roleGroup.messages.find(m => m.message === reaction.message.id)) continue

            for (const [_, roleMsg] of roleGroup.messages.entries()) {
                if (roleMsg.message !== reaction.message.id) continue

                const unreactedRole = roleMsg.reacts.find(r => r.emoji === reaction.emoji.identifier)

                let guildRole = null
                try { guildRole = await guild.roles.fetch(unreactedRole.role) }
                catch { return false }

                if (!guildRole) return false
                else if (!member.roles.cache.has(guildRole.id)) return true
                else {
                    const { nodm, rr: resetRole } = roleMsg
                    const { rolesRequired: requiredRoles, ignoreRoles } = roleGroup

                    if (!requiredRoles.arrayEmpty() && !member.roles.cache.every(r => requiredRoles.some(rq => rq === r.id))) return false
                    if (!ignoreRoles.arrayEmpty() && !member.roles.cache.some(r => ignoreRoles.some(ir => ir === r.id))) return false
                    if (!resetRole) return false

                    
                    await member.roles.remove(guildRole).catch((err) => this.client.logger.log('ERROR', err))

                    if (!nodm) await user.createDM().then(dm => dm.send(`**${guild.name}**: You have removed \`${guildRole.name}\``))
                }
            }
        }
    }
    //!Commented version found in ReactAddEvent, this follows similar procedure
}