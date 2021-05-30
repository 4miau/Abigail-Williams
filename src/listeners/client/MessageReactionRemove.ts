import { Listener } from 'discord-akairo'
import { MessageReaction, User } from 'discord.js'

import Starboard from '../../structures/StarboardManager'

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

        if (!this.client.settings.get(reaction.message.guild, 'starboard.starboardChannelID', '')) return;

        const emoji = Starboard.emojiFromID(this.client, this.client.settings.get(reaction.message.guild, 'starboard.emoji', '⭐'))
        if (Starboard.emojiEquals(reaction.emoji, emoji)) {
            const starboard = this.client.starboards.get(reaction.message.guild.id)
            if (starboard.reactionsRemoved.has(reaction.message.id)) {
                return starboard.reactionsRemoved.delete(reaction.message.id)
            }
    
            if (!reaction.count) return await starboard.deleteStarQueue(reaction.message)
    
            const error = await starboard.removeStarQueue(reaction.message, user)
            if (error) reaction.message.channel.send(`${user}, an error occured: ${error}`)
        }
    }
}