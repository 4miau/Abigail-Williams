import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

export default class ClearQueue extends Command {
    public constructor() {
        super('clearqueue', {
            aliases: ['clearqueue', 'cleanqueue', 'clearq'],
            category: 'Music',
            description: {
                content: 'Clears the current queue of tracks.',
                usage: 'clearqueue',
                examples: ['clearqueue'],
            },
            channel: 'guild',
            ratelimit: 3,
        })
    }

    //@ts-ignore
    userPermissions(message: Message) {
        const djRole: string = this.client.settings.get(message.guild, 'djRole', '')
        if (!djRole) return null

        const hasDJRole = message.member.roles.cache.has(djRole)
        if (!hasDJRole) return 'DJ Role required'
        return null
    }

    public async exec(message: Message): Promise<Message> {
        const checkVC = this.client.music.checkVC(message.member, true)
        if (typeof checkVC === 'string') return message.channel.send(checkVC)

        const queue = await this.client.music.guildQueue(message.guild)

        if (queue.songs.length > 0) {
            queue.clearQueue()
            return message.channel.send('The queue has successfully been cleared.')
                .then(msg => {
                    setTimeout(() => msg.delete(), 3000)
                    return msg
                })
        }
        else return message.channel.send('There are no songs in the queue. Failed to clear the queue.')
            .then(msg => {
                setTimeout(() => msg.delete(), 3000)
                return msg
            })
    }
}