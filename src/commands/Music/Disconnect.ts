import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

export default class Disconnect extends Command {
    public constructor() {
        super('disconnect', {
            aliases: ['disconnect', 'gtfo', 'getlost', 'disappear'],
            category: 'Music',
            description: {
                content: 'Will connect to the vc if not in one already.',
                usage: 'disconnect',
                examples: ['disconnect'],
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
        else {
            try {
                await this.client.music.guildQueue(message.guild).then(queue => queue.connection.leave())
                await this.client.music.guildQueue(message.guild).then(queue => queue.destroyed ? null : queue.destroy())
                return message.channel.send('I have disconnected from the voice channel.')
            } catch {
                this.client.logger.log('ERROR', 'Failed to destroy queue as it does not exist.')
            }
        }
    }
}