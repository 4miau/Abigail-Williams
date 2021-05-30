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

    public exec(message: Message): Promise<Message> {
        const usersVC = message.member.voice.channel
        if (!usersVC) return message.util!.send('You must be in a VC for me to disconnect.')

        if (this.client.manager.players.size) {
            const player = this.client.manager.players.first()

            if (player.voiceChannel === usersVC.id) {
                player.destroy()
                return message.util!.send('I have disconnected from the voice channel.')
            }
        }

        return message.util!.send('I am not currently in a voice channel.')
    }
}