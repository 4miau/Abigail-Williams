import { Command } from 'discord-akairo'
import { Message, MessageAttachment, MessageEmbed } from 'discord.js'
import { Track } from 'erela.js'
import moment, { now } from 'moment'

import { Colours } from '../../util/Colours'

export default class Play extends Command {
    public constructor() {
        super('playrewrite', {
            aliases: ['play', 'p', 'pl'],
            category: 'Music',
            description: {
                content: 'Plays track(s) based on a query, can be a single song or a playlist.',
                usage: 'play [nameoftrack/link]',
                examples: ['play https://youtube.com/song', 'play https://spotify.com/playlist', 'play https://soundcloud.com/song'],
            },
            ratelimit: 3,
            args: [
                {
                    id: 'query',
                    type: 'string'
                }
            ]
        })
    }

    public async exec(message: Message, {query}: {query: string}): Promise<Message> {
        if (!query) return message.util!.send('I need a song/title to query to add to the queue.')
        const scloud = message.attachments.first() || query //This is for soundcloud links since they need to be handled differently.

        const userVC = message.member.voice.channel
        if (!userVC) return message.util!.send('You must be in the same VC to play a song.')

        if (!this.client.manager.players.size) {
            this.client.manager.create({
                'guild': message.guild.id,
                'voiceChannel': userVC.id,
                'textChannel': message.channel.id,
                'node': 'root',
                'selfDeafen': true,
                'volume': 100,
            })
            .connect()
        }

        const player = this.client.manager.players.first()

        const trackResults = await this.client.manager.search(query || (scloud as MessageAttachment).url, message.author)

        if (trackResults.loadType === 'LOAD_FAILED') if (!player.queue.current) player.destroy()

        switch (trackResults.loadType) {
            case 'NO_MATCHES':
                if (!player.queue.current) player.destroy()
                return message.util!.send('No results found.')
            case 'TRACK_LOADED':
                player.queue.add(trackResults.tracks[0])
                if (!player.playing && !player.paused && !player.queue.size) player.play()
                return message.util!.send(new MessageEmbed()
                    .setDescription(`Added track ${trackResults.tracks[0].title} to the queue`)
                    .setImage(trackResults.tracks[0].thumbnail || trackResults.tracks[0].uri)
                    .setFooter(moment(now()).utcOffset(1).format('YYYY/M/DD hh:mm:ss a'))
                )
            case 'PLAYLIST_LOADED':
                player.queue.add(trackResults.tracks)   
                if (!player.playing && !player.paused && player.queue.totalSize === trackResults.tracks.length) await player.play()

                const ttl = trackResults.playlist.name
                const duration = moment(trackResults.playlist.duration).format('hh:mm:ss');

                const e = new MessageEmbed()
                    .setTitle('Playlist loaded | 🎵')
                    .addField("Title", `${ttl.length > 10 ? `${ttl.substring(0, 10)}...` : ttl}`, true)
                    .addField("Total", `\`${trackResults.tracks.length}\``, true)
                    .addField("Duration", `${duration}`, true)
                    .addField("Requester", `${trackResults.tracks[0].requester}`, true)
                    .setImage(trackResults.tracks[0]?.thumbnail ? trackResults.tracks[0]?.thumbnail : `https://img.youtube.com/vi/${trackResults.tracks[0].identifier}/maxresdefault.jpg`)


                return message.util!.send(e)
            case 'SEARCH_RESULT':
                let tracks: Track[]
                trackResults.tracks.length > 10 ? tracks = trackResults.tracks.slice(0, 10) : trackResults.tracks.slice(0, trackResults.tracks.length)

                const embed = new MessageEmbed()
                    .setAuthor(`Track Results [${trackResults.tracks.length}]`)
                    .setDescription(`${tracks.map((t: Track, i: number) => `[${i+1}] - ` + t.title).join('\n')}`)
                    .setColor(Colours.Mint)
                    .setFooter(`Requested by ${trackResults.tracks[0].requester}`)
            
                message.channel.send('Please enter a number indicating which song you would like to add to the queue.', embed)
                
                try {
                    const userResponse = Number((await message.channel.awaitMessages((msg: Message) => msg.author.id === message.author.id, { 'max': 1, 'time': 30000 })).first().content)
                    const track = tracks[userResponse - 1]
        
                    player.queue.add(track)

                    if (!player.playing && !player.paused && !player.queue.length) player.play()
                    return message.util!.send(`${track.title} has been added to the queue.`)
                } catch (err) { 
                    message.util!.message.delete({ 'timeout': 5000})
                    return await message.channel.send('Please provide a number to add to the queue. Please try again.')
                        .then(msg => msg.delete({ 'timeout': 5000 }))
                }

        }

        return message.util!.send('hi')
    }
}
