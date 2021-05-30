import { Command } from 'discord-akairo'
import { Message, MessageEmbed } from 'discord.js'

import { formatTime } from '../../util/Functions'

export default class NowPlaying extends Command {
    public constructor() {
        super('nowplaying', {
            aliases: ['nowplaying', 'np'],
            category: 'Music',
            description: {
                content: 'Returns information on the currently playing track.',
                usage: 'nowplaying',
                examples: ['nowplaying'],
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
        const players = this.client.manager.players
        if (!players.size) return message.util!.send('I am currently not in a VC.')

        const player = players.first()
        if (!player.queue.current) return message.util!.send('There are currently no songs in my queue.')

        const { title, author, duration, identifier } = player.queue.current
        const embed = new MessageEmbed()
            .setAuthor('Current song playing.', message.author.displayAvatarURL())
            .setImage(`http://i3.ytimg.com/vi/${identifier}/maxresdefault.jpg`)
            .setDescription(`
            ${player.playing ? "▶️" : "⏸️"} **${title}** \`${formatTime(duration)}\` by ${author}
            `)

        return message.util!.send(embed)
    }
}