import { Command } from 'discord-akairo'
import { Message, MessageEmbed } from 'discord.js'
import { Track } from 'erela.js'
import { Colours } from '../../util/Colours'

export default class Search extends Command {
    public constructor() {
        super('search', {
            aliases: ['search'],
            category: 'Music',
            description: {
                content: 'Searches for tracks based on a query.',
                usage: 'search [query/link]',
                examples: ['search Never Gonna Give You Up'],
            },
            channel: 'guild',
            ratelimit: 3,
            args: [
                {
                    id: 'query',
                    type: 'string',
                    match: 'rest'
                }
            ]
        })
    }

    public async exec(message: Message, {query}: {query: string}): Promise<Message> {
        const userVC = message.member.voice.channel

        const player = this.client.manager.players.size ? this.client.manager.players.first() : null

        const songs = await this.client.manager.search(query, message.author.tag)
        let tracks: Track[] 

        if (songs.tracks.length === 0) return (await message.util!.send('No results were returned.')).delete({ 'timeout': 2000})
        songs.tracks.length > 10 ? tracks = songs.tracks.slice(0, 10) : songs.tracks.slice(0, songs.tracks.length)

        const embed = new MessageEmbed()
            .setAuthor(`Track Results [${tracks.length}]`)
            .setDescription(`${tracks.map((t: Track, i: number) => `[${i+1}] - ` + t.title).join('\n')}`)
            .setColor(Colours.Mint)
            .setFooter(`Requested by ${tracks[0].requester}`)

        this.client.logger.log('INFO', `${songs.tracks.map(t => `${t.title}`).join(', ')}`)

        if (userVC && player) {
            message.util!.send('Please enter a number indicating which song you would like to add to the queue.', embed)

            try {
                const userResponse = Number((await message.channel.awaitMessages((msg: Message) => msg.author.id === message.author.id, { 'max': 1, 'time': 30000 })).first().content)
                const track = tracks[userResponse - 1]
    
                player.queue.add(track)
            } catch (err) { 
                message.util!.message.delete({ 'timeout': 2000})
                return await message.channel.send('Please provide a number to add to the queue. Please try again.')
                    .then(msg => msg.delete({ 'timeout': 2000 }))
            }
        } else return message.util!.send(embed)
    }
}