import axios from 'axios'
import { MessageEmbed, TextChannel, Guild } from 'discord.js'
import moment, { now } from 'moment'

import { envs } from '../../client/Components'
import { Colours } from '../Colours'

export async function createTwitchMessage(streamer: string, message: string): Promise<string> {
    const streamDetails = await _GetUserByName(streamer)
    return message
        .replaceAll('{title}', `${streamDetails.title}`)
        .replaceAll('{name}', `${streamDetails.display_name}`)
        .replaceAll('{game}', `${streamDetails.game_name}`)
        .replaceAll('{link}', `https://twitch.tv/${streamDetails.broadcaster_login}`)
}

export async function postMessage(guild: Guild, feedChannelID: string, streamer: { name: string, message: string, pings: string[], posted: boolean }): Promise<any> {
    const streamerDetails = await _GetUserByName(streamer.name)
    const stream = await _GetStream(streamer.name)

    const feedMessage = await createTwitchMessage(streamer.name, streamer.message)
    const feedChannel = guild.channels.resolve(feedChannelID) as TextChannel

    const streamEmbed = new MessageEmbed()
        .setAuthor(`${streamer.name} is now live on Twitch!`, streamerDetails.thumbnail_url)
        .setColor(Colours.Purple)
        .setThumbnail(streamerDetails.thumbnail_url)
        .setDescription(`
            **[${stream[0].title}](https://twitch.tv/${stream[0].user_login})**
    
            Playing ${stream[0].game_name} for ${stream[0].viewer_count} viewers
            [Watch Stream](https://twitch.tv/${stream[0].user_login})
        `)
        .setImage(stream[0].thumbnail_url.replace('{width}', '1280').replace('{height}', '720'))
    
    const addEmbed = feedMessage.endsWith('-embed')

    if (!addEmbed) return (await feedChannel.send(`${streamer.pings ? streamer.pings.join(', ') : ''} ` + feedMessage)).suppressEmbeds(true)
    else {
        streamEmbed.setFooter(`Abigail Williams • ${moment(now()).utcOffset(1).format('YYYY/M/DD hh:mm:ss a')}`)
        return feedChannel.send({ 
            content: `${streamer.pings ? streamer.pings.join(', ') : ''}\n` + feedMessage.replace('-embed', '') + ' ' , 
            embeds: [streamEmbed]
        })
    }
}

export async function _GetUserByName(streamerName: string): Promise<any> {
    try {
        const token = await axios.post(`https://id.twitch.tv/oauth2/token?client_id=${envs.twitchClientID}&client_secret=${envs.twitchClientSecret}&grant_type=client_credentials`)
            .then(res => res.data.access_token)
            .catch(void 0)

        const userFound = await axios.get(`https://api.twitch.tv/helix/search/channels?query=${streamerName}`, {
            headers: {
                'client-id': envs.twitchClientID,
                'Authorization': `Bearer ${token}`
            }
        })
        .then(async res => res.data.data.find((user: any) => user.broadcaster_login === streamerName))

        return userFound ? userFound : null 
    } catch {
        return null
    }
}

export async function _GetStream(streamerName: string): Promise<any> {
    try {
        const token = await axios.post(`https://id.twitch.tv/oauth2/token?client_id=${envs.twitchClientID}&client_secret=${envs.twitchClientSecret}&grant_type=client_credentials`)
        .then(res => res.data.access_token)
        .catch(void 0)

        const streamFound = await axios.get(`https://api.twitch.tv/helix/streams?user_login=${streamerName}`, {
            'headers': {
                'client-id': envs.twitchClientID,
                'Authorization': `Bearer ${token}`
            }
        })
        .then(res => res.data.data)

        return streamFound ? streamFound : null
    } catch {
        return null
    }
}