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

        if (this.client.manager.players.size) {
            const player = this.client.manager.players.first()

            if (player.voiceChannel !== userVC.id) return message.util!.send('You must be in the same VC to play a song.')

            const song = await this.client.manager.search(query, message.author)

            player.queue.add(song.tracks[0])
            message.channel.send(`Added track ${song.tracks[0].title} to the queue.`)

            if (!player.playing && !player.paused && !player.queue.size) player.play()

            if (player.paused) player.pause(false)
        }
    }

    private async querySong(player: Player, query: string): Promise<any> {

    }
}

/*
        const song = await this.client.manager.search(query, message.author)

        player.queue.add(song.tracks[0])
        message.channel.send(`Adding track ${song.tracks[0].title} to the queue.`)

        if (!player.playing && !player.paused && !player.queue.size) player.play()
        
        //for playlists
        //if (!player.playing && !player.paused && player.queue.totalSize === res.tracks.length()) player.play()
        
        //return message.util!.send('hi')
*/