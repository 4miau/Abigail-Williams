import { MessageReaction, User } from 'discord.js'

import Service from '../../modules/Service'

export default class ReactAddEvent extends Service {
    public constructor() {
        super('reactaddevent', {
            category: 'Reaction Role'
        })
    }

    async exec(reaction: MessageReaction, user: User): Promise<boolean> {
        const guild = reaction.message.guild
        const member = guild.members.resolve(user.id)
        const roleGroups: RoleGroup[] = this.client.settings.get(guild, 'role-groups', [])

        if (roleGroups.arrayEmpty()) return false

        this.client.logger.log('INFO', String(reaction.emoji.identifier))

        for (const [_, roleGroup] of roleGroups.entries()) {
            if (!roleGroup.messages.some(m => m.message === reaction.message.id)) continue

            for (const [_, roleMsg] of roleGroup.messages.entries()) {
                if (roleMsg.message !== reaction.message.id) continue

                const reactedRole = roleMsg.reacts.find(r => r.emoji === reaction.emoji.identifier)

                let guildRole = null
                try { guildRole = await guild.roles.fetch(reactedRole.role) }
                catch { return false }

                if (!guildRole) return false
                else if (member.roles.cache.has(guildRole.id)) return true
                else {
                    const { nodm } = roleMsg
                    const { singleLock, rolesRequired: requiredRoles, ignoreRoles } = roleGroup
    
                    if (!requiredRoles.arrayEmpty() && !member.roles.cache.every(r => requiredRoles.some(rq => rq === r.id))) return false
                    //User has none or not all required roles if there are required roles existing
                    if (!ignoreRoles.arrayEmpty() && !member.roles.cache.some(r => ignoreRoles.some(ir => ir === r.id))) return false
                    //User has at least 1 ignore role if there are ignored roles
    
                    if (singleLock) {
                        if (guild.roles.cache.some(role => roleGroup.roles.some(r => r === role.id) && role.id !== reactedRole.role)) {
                            //Finds all roles that isn't the reacted role from the menu, and excludes the role that the user just reacted to get
                            const oldRole = guild.roles.cache.find(role => roleGroup.roles.find(r => r === role.id) && role.id !== reactedRole.role)
                            const oldEmoji = roleMsg.reacts.find(r => r.role === oldRole.id).emoji
                            const oldReact = reaction.message.reactions.cache.find(react => react.emoji.identifier === oldEmoji)
        
                            await member.roles.remove(oldRole)
                            await oldReact.users.remove(user)
                        }
                    }
    
                    await member.roles.add(guildRole).catch((err) => this.client.logger.log('ERROR', err))
                    if (!nodm) await user.createDM().then(dm => dm.send(`**${guild.name}**: You have been given \`${guildRole.name}\``))
                }
            }
        }
    }
}