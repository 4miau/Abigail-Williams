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

    public exec(message: Message): Promise<Message> {
        const userVC = message.member.voice.channel

        if (!userVC) return message.util!.send('You must be in the same VC to pause the song.')

        const players = this.client.manager.players.size

        if (!players) return message.util!.send('I am currently not in a voice channel.')

        const player = this.client.manager.players.first()

        if (player.playing) {
            player.pause(true)
            return message.util!.send('I have stopped the current playing track.')
        }

        return message.util!.send('The song is currently not playing, or there is no song in the queue.')
    }
}