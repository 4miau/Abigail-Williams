import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

export default class ClearQueue extends Command {
    public constructor() {
        super('clearqueue', {
            aliases: ['clearqueue', 'cleanqueue', 'clearq'],
            category: 'Music',
            description: {
                content: 'Clears the current queue of tracks.',
                usage: 'clearqueue',
                examples: ['clearqueue'],
            },
            ratelimit: 3,
        })
    }

    public async exec(message: Message): Promise<Message> {
        const userVC = message.member.voice.channel

        if (!userVC) return message.util!.send('You must be in the same VC to play a song.')

        const players = this.client.manager.players.size
        if (!players) return message.util!.send('I am currently not in a voice channel.')

        const player = this.client.manager.players.first()

        const queue = player.queue

        if (queue) {
            queue.clear()
            return (await message.util!.send('The queue has been cleared successfully.')).delete({ 'timeout': 3000})
        }

        return (await message.util!.send('There is no queue, failed to clear the queue.')).delete({ 'timeout': 3000})
    }
}