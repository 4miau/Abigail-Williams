import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

export default class Loop extends Command {
    public constructor() {
        super('loop', {
            aliases: ['loop', 'repeat'],
            category: 'Music',
            description: {
                content: 'Loops the current track, or the current queue. (track by default if nothing passed in)',
                usage: 'loop <track/queue>',
                examples: ['loop', 'loop track', 'loop queue'],
            },
            channel: 'guild',
            ratelimit: 3,
            args: [
                {
                    id: 'loopType',
                    type: (_: Message, str: string): null | string => {
                        if (str) {
                            switch (str) {
                                case 'queue':
                                case 'q':
                                    return 'queue'
                                case 'track':
                                case 't':
                                    return 'track'
                                default:
                                    return 'track'
                            }
                        }
                        return 'track'
                    },
                    match: 'phrase'
                }
            ]
        })
    }

    public exec(message: Message, {loopType}: {loopType: string}): Promise<Message> {
        const userVC = message.member.voice.channel

        if (!userVC) return message.util!.send('You must be in the same VC to play a song.')

        const players = this.client.manager.players.size

        if (!players) return message.util!.send('I am currently not in a voice channel.')

        const player = this.client.manager.players.first()

        if (player.queue.totalSize) {
            if (loopType === 'track') {
                if (!player.trackRepeat) {
                    player.setTrackRepeat(true)
                    return message.util!.send('I will now continously loop the current playing track.')
                } else {
                    player.setTrackRepeat(false)
                    return message.util!.send('I will now stop continously looping the current playing track.')
                }
            }
            if (loopType === 'queue') {
                if (!player.queueRepeat) {
                    player.setQueueRepeat(true)
                    return message.util!.send('I will now continously loop the queue.')
                } else {
                    player.setQueueRepeat(false)
                    return message.util!.send('I will now stop continously looping the queue.')
                }
            }
        }
                
        return message.util!.send('There are no songs in the queue to loop.')
    }
}