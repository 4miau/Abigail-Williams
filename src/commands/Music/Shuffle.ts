import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

export default class Shuffle extends Command {
    public constructor() {
        super('shuffle', {
            aliases: ['shuffle'],
            category: 'Music',
            description: {
                content: 'Shuffles the queue into a random order.',
                usage: 'shuffle',
                examples: ['shuffle'],
            },
            channel: 'guild',
            ratelimit: 3,
        })
    }

    //@ts-ignore
    userPermissions(message: Message) {
        const djRole = this.client.settings.get(message.guild, 'djRole', '')

        if (!djRole) return null

        const hasDJRole = message.member.roles.cache.has(djRole)

        if (!hasDJRole) return 'DJ Role'
        return null
    }

    public exec(message: Message): Promise<Message> {
        const userVC = message.member.voice.channel
        if (!userVC) return message.util!.send('You must be in the same VC to shuffle a queue.')

        if (!this.client.manager.players.size) return message.util!.send('I am currently not in a vc, therefore I can not shuffle a non-existent queue.')

        const player = this.client.manager.players.first()

        if (!player.queue.size) return message.util!.send('There is no queue so I can not shuffle a non-existent queue.')

        player.queue.shuffle()
        
        return message.util!.send('Queue has been shuffled.')
    }
}