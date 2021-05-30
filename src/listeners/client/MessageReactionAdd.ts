import { Listener } from 'discord-akairo'
import { MessageReaction, TextChannel, User } from 'discord.js'

import Starboard from '../../structures/StarboardManager';

export default class MessageReactionAdd extends Listener {
    public constructor() {
        super('messagereactionadd', {
            emitter: 'client',
            event: 'messageReactionAdd',
            category: 'client'
        })
    }

    public async exec(reaction: MessageReaction, user: User) {
        if (user.id === this.client.user.id) return;
		if (reaction.message.partial) await reaction.message.fetch();
		if (!reaction.message.guild) return;

        if (!this.client.settings.get(reaction.message.guild, 'starboard.starboardChannelID', '')) return;

        const emoji = Starboard.emojiFromID(this.client, this.client.settings.get(reaction.message.guild, 'starboard.emoji', '⭐'))
        if (Starboard.emojiEquals(reaction.emoji, emoji)) {
            const starboard = this.client.starboards.get(reaction.message.guild.id)
            const err = await starboard.addStarQueue(reaction.message, user)
    
            if (err !== undefined) {
                if ((reaction.message.channel as TextChannel).permissionsFor(this.client.user).has('MANAGE_MESSAGES')) {
                    await reaction.users.remove(user).then(() => { starboard.reactionsRemoved.add(reaction.message.id)}).catch(null)
                }
    
                if (err.length && (reaction.message.channel as TextChannel).permissionsFor(this.client.user).has('SEND_MESSAGES')) {
                    reaction.message.channel.send(`${user}, error occurred: ${err}`)
                }
            }
        }
    }
}