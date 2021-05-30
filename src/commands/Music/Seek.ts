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
                examples: ['seek 1m', 'seek 30s'],
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

    public exec(message: Message, {time}: {time: number}): Promise<Message> {
        if (!time) return message.util!.send('No point of running the command if you aren\'t seeking to a new position in the song')

        if (!this.client.manager.players.size) return message.util!.send('I am not in a vc so I can not seek a non-existent track.')

        const player = this.client.manager.players.first()

        const userVC = message.member.voice.channel
        if (!userVC || userVC.id !== player.voiceChannel) return message.util!.send('You must be in the same VC to seek the current track.')

        try {
            player.seek(player.position + time)
            return message.util!.send('I have seeked to the new position of the song.')
        } catch {
            return message.util!.send('I can not seek to that point because either song ends at that point or you are trying to seek before the start of the song.')
        }
    }
}