import { Argument, Command } from 'discord-akairo'
import { Message } from 'discord.js'

export default class Seek extends Command {
    public constructor() {
        super('seek', {
            aliases: ['seek'],
            category: 'Music',
            description: {
                content: 'Seeks an input time in the current track. (Adds on time from the current position)',
                usage: 'seek [time]',
                examples: ['seek 1m', 'seek 30s', 'seek 3000'],
            },
            channel: 'guild',
            ratelimit: 3,
            args: [
                {
                    id: 'time',
                    type: Argument.union('time'),
                    match: 'rest'
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

    public async exec(message: Message, {time}: {time: number}): Promise<Message> {
        if (!time) return message.channel.send('No point of running the command if you aren\'t seeking to a new position in the song.')

        const checkVC = this.client.music.checkVC(message.member)
        if (typeof checkVC === 'string') return message.channel.send(checkVC)

        const queue = await this.client.music.guildQueue(message.guild)

        try {
            const nextSong = await queue.seek(time)
            return message.channel.send(nextSong instanceof Boolean ? 'Successfully seeked to new position of the song.' : 'Seeked to the next song.')
        } catch {
            return message.channel.send('Failed to seek, please try again.')
        }
    }
}