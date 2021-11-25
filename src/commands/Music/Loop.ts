import { Command } from 'discord-akairo'
import { RepeatMode } from 'discord-music-player'
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
                            switch (str.toLowerCase()) {
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

    //@ts-ignore
    userPermissions(message: Message) {
        const djRole: string = this.client.settings.get(message.guild, 'djRole', '')
        if (!djRole) return null

        const hasDJRole = message.member.roles.cache.has(djRole)
        if (!hasDJRole) return 'DJ Role'
        return null
    }

    public async exec(message: Message, {loopType}: {loopType: string}): Promise<Message> {
        const checkVC = this.client.music.checkVC(message.member)
        if (typeof checkVC === 'string') return message.channel.send(checkVC)

        const queue = await this.client.music.guildQueue(message.guild)

        if (queue.songs.length) {
            if (loopType === 'track') {
                queue.repeatMode === RepeatMode.SONG ? queue.setRepeatMode(RepeatMode.DISABLED) : queue.setRepeatMode(RepeatMode.SONG)
                return message.channel.send(queue.repeatMode === RepeatMode.SONG ? 'I will now loop the current playing track.' : 'I will stop looping the current track.')
            }
            else {
                queue.repeatMode === RepeatMode.QUEUE ? queue.setRepeatMode(RepeatMode.DISABLED) : queue.setRepeatMode(RepeatMode.QUEUE)
                return message.channel.send(queue.repeatMode === RepeatMode.QUEUE ? 'I will now loop the queue.' : 'I will stop looping the queue.')
            }
        }
        else return message.channel.send('There are no songs in the queue to loop.')
    }
}