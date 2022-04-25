import { Listener } from 'discord-akairo'
import { MessageReaction, Message, User } from 'discord.js'

import Abby from '../../../client/Abby'
import Starboard from '../../../structures/StarboardManager'

export default class MessageReactionRemove extends Listener {
    public constructor() {
        super('messagereactionremove', {
            emitter: 'client',
            event: 'messageReactionRemove',
            category: 'client'
        })
    }

    public async exec(reaction: MessageReaction, user: User) {
        if (user.id === this.client.user.id) return
		if (reaction.message.partial) await reaction.message.fetch()
		if (!reaction.message.guild) return

        if (this.client.settings.get(reaction.message.guild, 'starboard.starboardChannelID', '')) { 
            const emoji = Starboard.emojiFromID(this.client as Abby, this.client.settings.get(reaction.message.guild, 'starboard.emoji', '⭐'))

            if (Starboard.emojiEquals(reaction.emoji, emoji)) {
                const starboard = this.client.starboards.get(reaction.message.guild.id)
                if (starboard.reactionsRemoved.has(reaction.message.id)) {
                    return starboard.reactionsRemoved.delete(reaction.message.id)
                }
        
                if (!reaction.count) this.client.queue.add(starboard.deleteStarQueue(reaction.message as Message))
        
                const error = await starboard.removeStarQueue(reaction.message as Message, user)
                if (error) reaction.message.channel.send(`${user}, an error occured: ${error}`)
            }
        }

        const roleGroups: RoleGroup[] = this.client.settings.get(reaction.message.guild, 'role-groups', [])
        if (!roleGroups.arrayEmpty()) {
            const reactRemoveService = this.client.serviceHandler.modules.get('reactremoveevent')
            const err = await reactRemoveService.exec(reaction, user)
            
            if (err === false) this.client.logger.log('ERROR', `Unable to remove the role from ${user.tag} (${user.id}) for an unexpected reason.`)
            else if (err === true) this.client.logger.log('CAUTION', `Unable to remove role from ${user.tag} (${user.id}) as they do not have the role.`)
        }
    }
}