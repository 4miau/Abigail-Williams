import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

export default class Star extends Command {
    public constructor() {
        super('star', {
            aliases: ['star'],
            category: 'Starboard',
            description: {
                content: 'Stars a message.',
                usage: 'star [messageID]',
                examples: ['star 1234567890'],
            },
            channel: 'guild',
            ratelimit: 3,
            args: [
                {
                    id: 'msg',
                    type: 'message'
                }
            ]
        })
    }

    public async exec(message: Message, {msg}: {msg: Message}): Promise<Message> {
        if (!msg) return message.channel.send('You must provide a message\'s ID for me to add a star on.')

        const starboard = this.client.starboards.get(message.guild.id)
        const err = await starboard.addStarQueue(msg, message.author)

        if (err && err.length) return message.channel.send(err)
        else return message.channel.send('The message has been starred.')
    }
}