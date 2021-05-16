import { Command } from 'discord-akairo'
import { Message, MessageEmbed } from 'discord.js'
import { Colours } from '../../util/Colours'

export default class Queue extends Command {
    public constructor() {
        super('queue', {
            aliases: ['queue', 'getqueue', 'q'],
            category: 'Music',
            description: {
                content: 'Gets the current queue.',
                usage: 'queue',
                examples: ['queue'],
            },
            ratelimit: 3,
        })
    }

    public exec(message: Message): Promise<Message> {
        const userVC = message.member.voice.channel

        if (!userVC) return message.util!.send('You must be in the same VC to play a song.')

        const players = this.client.manager.players.size

        if (!players) return message.util!.send('I am currently not in a voice channel.')

        const player = this.client.manager.players.first()

        if (player.queue.totalSize) {
            const queue = player.queue
            message.util!.send(new MessageEmbed()
                .setAuthor('Current track queue | 🎵')
                .setColor(Colours.Mint)
                .setDescription(`
                    ${queue.map(t => t.title + '(' + t.duration + ')').join('\n')}
                `)
            )
        }

        return message.util!.send('I have no songs in my queue. Please add some songs then try that.')
    }
}