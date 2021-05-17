import { Command } from 'discord-akairo'
import { Message } from 'discord.js'
import { Player } from 'erela.js'

export default class Play extends Command {
    public constructor() {
        super('play', {
            aliases: ['play', 'p', 'pl'],
            category: 'Music',
            description: {
                content: 'Adds a song onto the queue',
                usage: 'play [title/link]',
                examples: ['play casper the ghost theme'],
            },
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

    public async exec(message: Message, {query}: {query: string}): Promise<any> {
        if (!query) return message.util!.send('I need a song/title to query to add to the queue.')

        const userVC = message.member.voice.channel
        if (!userVC) return message.util!.send('You must be in the same VC to play a song.')

        if (!this.client.manager.players.size) {
            const player = this.client.manager.create({
                'guild': message.guild.id,
                'voiceChannel': userVC.id,
                'textChannel': message.channel.id,
                'node': 'root',
                'volume': 100
            })
    
            player.connect()
            
            message.channel.send('Joined the current VC you are in.')
        }

        const player = this.client.manager.players.first()

            const sc = message.attachments.first() || query

            const song = await this.client.manager.search(query || (sc as MessageAttachment).url, message.author) || void 0

            try {
                if (song.loadType === "LOAD_FAILED" || !song) {
                    if (!player.queue.current) player.destroy();
                    throw new Error(song.exception.severity + ': ' + song.exception.message)
                }
            } catch (err) {
                return message.util!.send(`An error occurred while searching ${err.message}`)
            }

            player.queue.add(song.tracks[0])
                    if (!player.playing && !player.paused && !player.queue.size) player.play()
                    return message.channel.send(`Added track ${song.tracks[0].title} to the queue.`)
                case 'PLAYLIST_LOADED':
                    player.queue.add(song.tracks)
                    if (!player.playing && !player.paused && player.queue.size === song.tracks.length) player.play()
                    const duration = moment(song.tracks.reduce((acc, cur) => <any>(acc.duration + cur.duration)).duration).format('hh:mm:ss')
                    const ttl = song.playlist.name
                    return message.channel.send(new MessageEmbed()
                        .setTitle('Playlist loaded | 🎵')
                        .addField("Title", `${ttl.length > 10 ? `${ttl.substring(0, 10)}...` : ttl}`, true)
                        .addField("Total", `\`${song.tracks.length}\``, true)
                        .addField("Duration", `${duration}`, true)
                        .addField("Requester", `${song.tracks[0].requester}`, true)
                        .setImage(`https://img.youtube.com/vi/${song.tracks[0].identifier}/maxresdefault.jpg`)
                    )
                case 'SEARCH_RESULT':
                    const embed = new MessageEmbed()
                        .setAuthor(`Track Results [${song.tracks.length}]`)
                        .setDescription(`${song.tracks.map((t: Track, i: number) => `[${i+1}] - ` + t.title).join('\n')}`)
                        .setColor(Colours.Mint)
                        .setFooter(`Requested by ${song.tracks[0].requester}`)
                    
                    message.channel.send('Please enter a number indicating which song you would like to add to the queue.', embed)

                    try {
                        const userResponse = Number((await message.channel.awaitMessages((msg: Message) => msg.author.id === message.author.id, { 'max': 1, 'time': 30000 })).first().content)
                        const track = song.tracks[userResponse - 1]
            
                        player.queue.add(track)
                        return message.util!.send(`${track.title} has been added to the queue.`)
                    } catch (err) { 
                        message.util!.message.delete({ 'timeout': 2000})
                        return await message.channel.send('Please provide a number to add to the queue. Please try again.')
                            .then(msg => msg.delete({ 'timeout': 2000 }))
                    }
            }
        }
    }

    private async querySong(player: Player, query: string): Promise<any> {

    }
}
