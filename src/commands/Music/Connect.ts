import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

export default class Connect extends Command {
    public constructor() {
        super('connect', {
            aliases: ['connect', 'join'],
            category: 'Music',
            description: {
                content: 'Will connect to the vc if not in one already.',
                usage: 'connect',
                examples: ['connect'],
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

        await this.client.music.guildQueue(message.guild, true, checkVC.id)
        return message.channel.send('I have successfully connected to the voice channel.')
    }
}