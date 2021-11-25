import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

export default class Pause extends Command {
    public constructor() {
        super('pause', {
            aliases: ['pause', 'stop'],
            category: 'Music',
            description: {
                content: 'Will pause the current playing track.',
                usage: 'pause',
                examples: ['pause'],
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
        if (!hasDJRole) return 'DJ Role'
        return null
    }

    public async exec(message: Message): Promise<Message> {
        const checkVC = this.client.music.checkVC(message.member)
        if (typeof checkVC === 'string') return message.channel.send(checkVC)

        const queue = await this.client.music.guildQueue(message.guild)

        if (queue.isPlaying || !queue.paused) {
            queue.setPaused(true)
            return message.channel.send('I have stopped the currently playing track.')
        }
        else return message.channel.send('The song is already paused, or there are no songs in the queue. Use `resume` to unpause the song.')
    }
}