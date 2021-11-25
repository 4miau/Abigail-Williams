import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

export default class Resume extends Command {
    public constructor() {
        super('resume', {
            aliases: ['resume'],
            category: 'Music',
            description: {
                content: 'Resumes a paused song.',
                usage: 'resume',
                examples: ['resume'],
            },
            channel: 'guild',
            ratelimit: 3
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

        if (!queue.isPlaying || queue.paused) {
            queue.setPaused(false)
            return message.channel.send('Resumed the current track.')
        }
        else return message.channel.send('The song is not paused, or there are no songs in the queue. Use `pause` to unpause the song.')
    }
}