import { Listener } from 'discord-akairo'
import { Message } from 'discord.js'

export default class MessageReactionRemoveAll extends Listener {
    public constructor() {
        super('messagereactionremoveall', {
            emitter: 'client',
            event: 'messageReactionRemoveAll',
            category: 'client'
        })
    }

    public async exec(message: Message) {
        if (message.partial) await message.fetch()
        if (!message.guild) return

        const starboard = this.client.starboards.get(message.guild.id)

        if (starboard.reactionsRemoved.has(message.id)) starboard.reactionsRemoved.delete(message.id)

        this.client.queue.add(starboard.deleteStarQueue(message))
    }
}