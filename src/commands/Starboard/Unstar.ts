import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

import Star from '../../models/Star'

export default class Unstar extends Command {
    public constructor() {
        super('unstar', {
            aliases: ['unstar'],
            category: 'Starboard',
            description: {
                content: 'Unstars a message.',
                usage: 'unstar [messageID]',
                examples: ['unstar 1234567890'],
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
        if (!msg) return message.channel.send('You must provide a message\'s ID for me to remove a star from.')
        if (msg.author.id === message.author.id) return message.channel.send('You can\'t unstar your own message.')

        const starboard = this.client.starboards.get(message.guild.id)

        if (!starboard.channel) return message.channel.send('This server does not have a starboard channel to use. Set one using the starboard command.')

        const star = await Star.findOne({ message: msg.id })

        if (!star || !star.starredBy.includes(message.author.id)) return message.channel.send('You can not remove a star from a message you never gave a star to in the first place.')

        const err = await starboard.removeStarQueue(msg, message.author)
        if (err) return message.channel.send(err)
        else return message.channel.send('The message has been unstarred.')
    }
}