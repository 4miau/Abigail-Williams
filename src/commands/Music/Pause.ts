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

    public exec(message: Message): Promise<Message> {
        const userVC = message.member.voice.channel
        if (!userVC) return message.util!.send('You must at least be in a VC to try to pause the song.')

        const players = this.client.manager.players.size
        if (!players) return message.util!.send('I am currently not in a voice channel.')

        const player = this.client.manager.players.first()

        if (userVC.id !== player.voiceChannel) return message.util!.send('You need to be in the same VC to pause the song.')

        if (player.playing) {
            player.pause(true)
            return message.util!.send('I have stopped the current playing track.')
        }

        return message.util!.send('The song is currently not playing, or there is no song in the queue.')
    }
}