import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

export default class Volume extends Command {
    public constructor() {
        super('volume', {
            aliases: ['volume'],
            category: 'Music',
            description: {
                content: 'Gets/sets the volume of the bot.',
                usage: 'volume <1-100>',
                examples: ['volume', 'volume 50'],
            },
            channel: 'guild',
            ownerOnly: true,
            ratelimit: 3,
            args: [
                {
                    id: 'volume',
                    type: 'number',
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

    public exec(message: Message, {volume}: {volume: number}): Promise<Message> {
        if (volume && isNaN(volume)) return message.util!.send('If you wish to provide a number, it needs to be a number...')
        const players = this.client.manager.players.size

        if (!players) return message.util!.send('I am currently not in a voice channel.')

        const player = this.client.manager.players.first()

        if (!volume) return message.util!.send(`Current volume: ${player.volume}`)
        else {
            player.setVolume(volume)
            return message.util!.send(`I have set my new volume to ${volume}`)
        }
    }
}