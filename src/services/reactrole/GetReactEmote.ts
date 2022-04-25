import { Message, GuildEmoji, ReactionEmoji, MessageReaction, User } from 'discord.js'

import Service from '../../modules/Service'

export default class GetReactEmote extends Service {
    public constructor() {
        super('getreactemote', {
            category: 'Reaction Role'
        })
    }

    async exec(m: Message, reactMsg: Message, origMsg: Message = null): Promise<GuildEmoji | ReactionEmoji> {
        const filter = (_: MessageReaction, u: User) => u.id === m.author.id
        const reaction = (await reactMsg.awaitReactions({ filter: filter, maxEmojis: 1, max: 1, time: 3e5 }))?.first()
    
        const emote = reaction.emoji
        if (emote instanceof GuildEmoji && !emote.available) {
            m.channel.send('This emoji is not available, please use another emoji that is available.')
            return this.exec(m, reactMsg, origMsg)
        }
        else if (emote instanceof ReactionEmoji) {
            try { 
                if (origMsg) await origMsg.react(emote)
                return emote
            }
            catch {
                m.channel.send('I am unable to access this emote, please use another emoji that is available.')
                return this.exec(m, reactMsg, origMsg)
            }
        }
        else {
            if (origMsg) await origMsg.react(emote)
            return emote
        }
    }
}