import { Listener } from 'discord-akairo'
import { MessageReaction, Message, TextChannel, User } from 'discord.js'

import Abby from '../../../client/Abby'
import Starboard from '../../../structures/StarboardManager'

export default class MessageReactionAdd extends Listener {
    public constructor() {
        super('messagereactionadd', {
            emitter: 'client',
            event: 'messageReactionAdd',
            category: 'client'
        })
    }

    public async exec(reaction: MessageReaction, user: User) {
        if (user.id === this.client.user.id) return
		if (reaction.message.partial) await reaction.message.fetch(true)
		if (!reaction.message.guild) return

        if (this.client.settings.get(reaction.message.guild, 'starboard.starboardChannelID', '')) {
            const emoji = Starboard.emojiFromID(this.client as Abby, this.client.settings.get(reaction.message.guild, 'starboard.emoji', '⭐'))
            if (Starboard.emojiEquals(reaction.emoji, emoji)) {
                const starboard = this.client.starboards.get(reaction.message.guild.id)
                const err = await starboard.addStarQueue(reaction.message as Message, user)
    
                if (err) {
                    if ((reaction.message.channel as TextChannel).permissionsFor(this.client.user).has('MANAGE_MESSAGES')) {
                        await reaction.users.remove(user).then(() => { starboard.reactionsRemoved.add(reaction.message.id)}).catch(null)
                    }
        
                    if (err.length && (reaction.message.channel as TextChannel).permissionsFor(this.client.user).has('SEND_MESSAGES')) {
                        reaction.message.channel.send(`${user}, error occurred: ${err}`)
                    }
                }
            }
        }

        const roleGroups: RoleGroup[] = this.client.settings.get(reaction.message.guild, 'role-groups', [])
        if (!roleGroups.arrayEmpty()) {
            const reactAddService = this.client.serviceHandler.modules.get('reactaddevent')
            const err = await reactAddService.exec(reaction, user)
            
            if (err === false) this.client.logger.log('ERROR', `Unable to add the role to ${user.tag} (${user.id}) for an unexpected reason.`)
            else if (err === true) this.client.logger.log('CAUTION', `Unable to add role to ${user.tag} (${user.id}) as they already have the role.`)
        }
    }
}