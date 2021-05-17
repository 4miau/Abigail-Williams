import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

export default class Skip extends Command {
    public constructor() {
        super('skip', {
            aliases: ['skip'],
            category: 'Music',
            description: {
                content: 'Skips to the next song in the queue. If you provide a position, it will skip that many songs instead (inclusive).',
                usage: 'skip <tracksToSkip>',
                examples: ['skip', 'skip 5'],
            },
            channel: 'guild',
            ratelimit: 3,
            args: [
                {
                    id: 'track',
                    type: 'number',
                    match: 'phrase',
                    default: 1
                }
            ]
        })
    }

    public exec(message: Message, {track}: {track: number}): Promise<Message> {
        const userVC = message.member.voice.channel

        if (!userVC) return message.util!.send('You must be in the same VC to play a song.')

        const players = this.client.manager.players.size

        if (!players) return message.util!.send('I am currently not in a voice channel.')

        const player = this.client.manager.players.first()

        if (player.queue.size) {
            player.stop(track)
            return message.util!.send(`I have skipped ${track > 1 ? track + ' tracks' : 'the current playing track'}`)
        } else return message.util!.send('I can not skip songs as there is nothing in my queue.')
    }
}