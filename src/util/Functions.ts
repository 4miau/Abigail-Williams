import { Guild, GuildMember, MessageEmbed, TextChannel } from "discord.js"
import axios from 'axios'
import moment, { now } from "moment"

import { twitchClientID, twitchClientSecret, danbooruAPIkey } from "../Config"
import { Colours } from "./Colours"


//MISC FUNCTIONS

export function getRandomInt(length: number): number {
    return Math.floor(Math.random() * length)
}

//ARRAY-BASED FUNCTIONS

export function getRandomIntRange(min: number, max: number): number {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * ((max - min) + 1))
}

export function shuffleArray(arr: string[]): string[] {
    for (let i = arr.length - 1; i > 0; i--) {
        const j: number = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]]
    }

    return arr
}

export function chunk(arr: string[], size: number): string[] {
    const newArr = []
    for (let i = 0; i < arr.length; i += size) newArr.push(arr.slice(i, i + size))
    
    return newArr
}

export function chunkNewLine(arr: string[], size: number): string[] {
    for (let i = 0; i < arr.length; i += size)  arr[i] += '\n'
    return arr
}

//GUILD FUNCTIONS

export function getJoinPosition(member: GuildMember, guild: Guild): number {
    if (!member || !guild) return

    const memberIDArr = guild.members.cache.sort((a: any, b: any) =>  a.joinedAt - b.joinedAt).keyArray()
    return (memberIDArr.findIndex(id => id === member.id) + 1)
}

//API-BASED FUNCTIONS

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

    streamer.pings ? streamer.pings = streamer.pings.map(s => {
        if (s === '@everyone') return s
        else return `<@&${s}>`
    }) : void 0

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

    if (!addEmbed) return (await feedChannel.send(`${streamer.pings ? streamer.pings.join(', ') : ''}\n` + feedMessage)).suppressEmbeds(true)
    else {
        return await feedChannel.send(`${streamer.pings ? streamer.pings.join(', ') : ''}\n` + feedMessage.replace('-embed', '') + '\n', {
            embed: streamEmbed
                .setFooter(`Abigail Williams - ${moment(now()).utcOffset(1).format('YYYY/M/DD hh:mm:ss a')}`)
        })
    }
}

//API FUNCTIONS

export async function _DanbooruQuery(tag: string): Promise<any> {
    const query = await axios.get(`danbooru.donmai.us/posts.json?search=${tag}?limit=1`, {
        'headers': {
            'Authorization': `Basic ${danbooruAPIkey}`
        },
        'method': 'GET'
    })
    .then(res => res.data)

    if (query) return query
    return null
}

export async function _GetUserByName(streamerName: string): Promise<any> {
    const token = await axios.post(`https://id.twitch.tv/oauth2/token?client_id=${twitchClientID}&client_secret=${twitchClientSecret}&grant_type=client_credentials`)
        .then(res => res.data.access_token)
        .catch(void 0)
    
    const findUser = await axios.get(`https://api.twitch.tv/helix/search/channels?query=${streamerName}`, {
        'headers': {
            'client-id': twitchClientID,
            'Authorization': `Bearer ${token}`
        },
        'method': 'GET'
    })
    .then(async res => {
        const user = res.data.data.find((user: any) => user.broadcaster_login === streamerName)
        if (user) return user
        else return void 0
    })
    .catch(void 0)

    if (findUser) return findUser
    return null
}

export async function _GetStream(streamerName: string): Promise<any> {
    const token = await axios.post(`https://id.twitch.tv/oauth2/token?client_id=${twitchClientID}&client_secret=${twitchClientSecret}&grant_type=client_credentials`)
        .then(res => res.data.access_token)
        .catch(void 0)

        const findStream = await axios.get(`https://api.twitch.tv/helix/streams?user_login=${streamerName}`, {
            'headers': {
                'client-id': twitchClientID,
                'Authorization': `Bearer ${token}`
            },
            'method': 'GET'
        })
        .then(res => res.data.data)

        if (findStream) return findStream
        return null
}

export async function _GetAnimeSFW(category: string): Promise<any> {
    return await axios.get(`https://api.waifu.pics/sfw/${category}`, { 'method': 'GET' })
        .then(res => res.data)
}