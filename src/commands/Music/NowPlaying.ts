import { Command } from 'discord-akairo'
import { Message, MessageEmbed } from 'discord.js'

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

    public async exec(message: Message): Promise<Message> {
        if (!this.client.music.hasQueue(message.guild)) return message.channel.send('I have no queue so there are no songs playing.')

        const queue = await this.client.music.guildQueue(message.guild)
        const progressBar = queue.createProgressBar({ time: true })

        const e = new MessageEmbed()
            .setAuthor('Current track playing')
            .setTitle(queue.nowPlaying.name)
            .setImage(queue.nowPlaying.thumbnail)
            .setURL(queue.nowPlaying.url)
            .setDescription(progressBar.prettier)
        

        return message.channel.send({ embeds: [e] })
    }
}