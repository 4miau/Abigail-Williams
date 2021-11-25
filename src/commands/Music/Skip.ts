import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

export default class Skip extends Command {
    public constructor() {
        super('skip', {
            aliases: ['skip'],
            category: 'Music',
            description: {
                content: 'Skips to the next song in the queue. If you provide a number, it will skip that many songs instead (inclusive).',
                usage: 'skip <tracksToSkip>',
                examples: ['skip', 'skip 5'],
            },
            channel: 'guild',
            ratelimit: 3,
            args: [
                {
                    id: 'trackPos',
                    type: 'number',
                    match: 'phrase',
                    default: 1
                }
            ]
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

    public async exec(message: Message, {trackPos}: {trackPos: number}): Promise<Message> {
        const checkVC = this.client.music.checkVC(message.member)
        if (typeof checkVC === 'string') return message.channel.send(checkVC)

        const queue = await this.client.music.guildQueue(message.guild)

        try {
            queue.skip(trackPos - 1)
            return message.channel.send('Successfully skipped song(s).')
        } catch {
            return message.channel.send('Unable to skip that many songs.')
        }
    }
}