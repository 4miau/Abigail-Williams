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
                    default: null
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

    public async exec(message: Message, {volume}: {volume: number}): Promise<Message> {
        if (volume && isNaN(volume)) return message.channel.send('Provide a number between 0 - 100 for the volume.')

        const checkVC = this.client.music.checkVC(message.member, true)
        if (typeof checkVC === 'string') return message.channel.send(checkVC)

        const queue = await this.client.music.guildQueue(message.guild)

        if (volume === null) return message.channel.send(`Current volume: ${queue.volume}`)
        else if (volume > 0 && volume < 100) {
            queue.setVolume(volume)
            return message.channel.send(`I have set the volume to \`${volume}\``)
        }
        else return message.channel.send('Provide a value between *0 - 100* for the volume.')
    }
}