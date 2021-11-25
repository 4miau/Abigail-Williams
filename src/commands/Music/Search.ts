import { Command } from 'discord-akairo'
import { Message, MessageEmbed, Role } from 'discord.js'
import { Playlist, Song } from 'discord-music-player'

import { Colours } from '../../util/Colours'
import { getMsgResponse } from '../../util/functions/misc'

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
        const queue = await this.client.music.guildQueue(message.guild, true)
        const songs = await this.client.music.searchSongs(query, queue)

        if (!songs) {
            return message.channel.send('No results were found.')
                .then(m => {
                    setTimeout(() => m.delete(), 2000)
                    return m
                })
        }

        if (songs instanceof Song) return this.client.music.selectSong(message, songs, queue)
        else if (songs instanceof Array) return this.client.music.selectSongFromArr(message, songs, queue)
        else return message.channel.send({ embeds: [await this.client.music.enqueue(songs, queue, message.author)] })
    }
}