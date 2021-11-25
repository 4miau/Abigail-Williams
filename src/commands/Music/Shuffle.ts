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

    public async exec(message: Message): Promise<Message> {
        const checkVC = this.client.music.checkVC(message.member)
        if (typeof checkVC === 'string') return message.channel.send(checkVC)

        const queue = await this.client.music.guildQueue(message.guild, false)

        if (!queue.songs.length) return message.channel.send('There are no songs in the queue, I can not shuffle a non-existent queue.')
        else {
            queue.shuffle()
            return message.channel.send('Shuffled the queue.')
        }
    }
}