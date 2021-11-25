import { Command } from 'discord-akairo'
import { Song, Playlist, Utils } from 'discord-music-player'
import { Message, MessageAttachment, MessageEmbed, MessageReaction } from 'discord.js'
import moment, { now } from 'moment'
import ms from 'ms'

import { Colours } from '../../util/Colours'

export default class Play extends Command {
    public constructor() {
        super('play', {
            aliases: ['play', 'p', 'pl'],
            category: 'Music',
            description: {
                content: 'Plays track(s) based on a query, can be a single song or a playlist.',
                usage: 'play [trackName/link]',
                examples: ['play https://youtube.com/song', 'play https://spotify.com/playlist', 'play rick astley'],
            },
            channel: 'guild',
            ratelimit: 3,
            args: [
                {
                    id: 'query',
                    type: 'string'
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

    public async exec(message: Message, {query}: {query: string}): Promise<Message> {
        if (!query) return message.channel.send('I need a title/link to query to add to the queue.')

        const checkVC = this.client.music.checkVC(message.member)
        if (typeof checkVC === 'string') return message.channel.send(checkVC)

        const queue = await this.client.music.guildQueue(message.guild, true, checkVC.id)
        const result = await this.client.music.searchSongs(query, queue)

        
        if (!result) {
            return message.channel.send('No results were found.')
                .then(m => {
                    setTimeout(() => m.delete(), 2000)
                    return m
                })
        }

        try {
            await this.client.music.reconnectQueue(queue, message.member.voice.channel)
            if (result instanceof Array) return this.client.music.selectSongFromArr(message, result, queue)
            else return message.channel.send({ embeds: [await this.client.music.enqueue(result, queue, message.author, true)] })
        } catch (err) {
            this.client.logger.log('ERROR', err)
            return message.channel.send('Failed to play song in voice channel, please report this to miau#0004.')
        }
    }
}