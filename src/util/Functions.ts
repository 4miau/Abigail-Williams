import { AkairoClient } from "discord-akairo"
import { Guild, GuildMember, MessageEmbed, TextChannel, Collection, Snowflake, Message, Role } from "discord.js"
import axios from 'axios'
import moment, { now } from "moment"
import fs from 'fs'
import { join } from "path"

import { twitchClientID, twitchClientSecret, danbooruAPIkey, apexAPIkey, twitterToken } from "../Config"
import { Colours } from "./Colours"



//MISC FUNCTIONS

export function getRandomInt(length: number): number {
    return Math.floor(Math.random() * length)
}

export function ConvertRank(rank: string): string {
    if (rank.includes('Bronze')) return '<:1Bronze:842770590993350687>'
    if (rank.includes('Silver')) return '<:2Silver:842770591614631966>'
    if (rank.includes('Gold')) return '<:3Gold:842770591798394900>'
    if (rank.includes('Platinum')) return '<:4Platinum:842770592424001586>'
    if (rank.includes('Diamond')) return '<:5Diamond:842770592411025448>'
    if (rank.includes('Master')) return '<:6Master:842770593027850260>'
    if (rank.includes('Apex Predator')) return '<:7ApexPredator:842770592553238548>'
}

export function formatTime(ms: number): string {
    const time = { s: 0, m: 0, h: 0, d: 0 }

    time.s = Math.floor(ms / 1000)
    time.m = Math.floor(time.s / 60)
    time.s %= 60
    time.h = Math.floor(time.m / 60);
    time.m %= 60;
    time.d = Math.floor(time.h / 24);
    time.h %= 24;

    const res = []
    for (const [_, v] of Object.entries(time)) {
        let first = false
        if (v < 1 && !first) continue

        res.push(v < 10 ? `0${v}` : `${v}`)
        first = true
    }

    return res.join(':')
}

//FILE-ACCESS FUNCTIONS

export function createFileDirs() {
    fs.mkdir(join(__dirname, '..', 'bulkLogs'), () => void 0)
    fs.mkdir(join(__dirname, '..', 'DMs'), () => void 0)
}

export function createDelMsgFile(ac: AkairoClient, deletedMessages: Collection<Snowflake, Message>) {
    const directory = join(__dirname, '..', 'bulkLogs')

    fs.readdir(directory, (err, files) => {
        err ? ac.logger.log('ERROR', `Error Message: ${err}`) : void 0

        const noOfLogs: number = files.length + 1

        fs.writeFile(join(directory, `bulk-log [${noOfLogs}]`), deletedMessages.map(dm => {
            return `[${moment(dm.createdAt).format('YYYY/MM/DD HH:mm:ss')}] ${dm.author.tag} (${dm.author.id}) : ${dm.content}`
        }).join('\n'), err => ac.logger.log('ERROR', `${err}`))
    })
}

export function appendDMFile(ac: AkairoClient, message: Message) {
    const directory = join(__dirname, '..', 'DMs')

    fs.readdir(directory, (err) => {
        err ? ac.logger.log('ERROR', `Error Message: ${err}`) : void 0

        fs.appendFile(join(directory, `${message.author.tag}`), 
        `[${moment(message.createdAt).format('YYYY/MM/DD HH:mm:ss')}] ${message.author.tag} (${message.author.id}) : ${message.content}\n`,
        err => void 0)
    })
}

//ARRAY-BASED FUNCTIONS

export function getRandomIntRange(min: number, max: number): number {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * ((max - min) + 1))
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

export async function manageAutorole(message: Message, role: Role, autoRoles: { human: string[], bots: string[], all: string[] }, target: string, add: boolean ): Promise<Message> {
    const manageAutoRole = {
        'human': async (add: boolean) => {
            add ?
            () => {
                if (!autoRoles.human || autoRoles.human.length <= 0) {
                    this.client.settings.set(message.guild, 'autoRoles.human', [role.id])
                    return message.util!.send('Successfully added new autorole for humans.')
                }
                if (autoRoles.human && autoRoles.human.includes(role.id)) return message.util!.send('This role is already on the autorole list for humans.')
                
                autoRoles.human.push(role.id)
                this.client.settings.set(message.guild, 'autoRoles.human', autoRoles.human)

                return message.util!.send('Successfully added new autorole for humans.')
            } :
            () => {
                if (!autoRoles.human || autoRoles.human.length === 0) return message.util!.send('There are no autoroles for humans exclusively.')
                if (!autoRoles.human.includes(role.id)) return message.util!.send('This role is not on the human autorole list.')
 
                this.client.settings.set(message.guild, 'autoRoles.human', autoRoles.human.filter(ar => ar !== role.id))
                return message.util!.send('Successfully removed role from the human autorole list.')
            }
        },

        'bots': async (add: boolean) => {
            add ?
            () => {
                if (!autoRoles.bots || autoRoles.bots.length === 0) {
                    this.client.settings.set(message.guild, 'autoRoles.bots', [role.id])
                    return message.util!.send('Successfully added new autorole for bots.')
                }
                if (autoRoles.bots.includes(role.id)) return message.util!.send('This role is already on the autorole list for bots.')

                autoRoles.bots.push(role.id)
                this.client.settings.set(message.guild, 'autoRoles.bots', autoRoles.bots)
                
                return message.util!.send('Successfully added new autorole for bots.')
            } :
            () => {
                if (!autoRoles.bots || autoRoles.bots.length === 0) return message.util!.send('There are no autoroles for bots exclusively.')
                if (!autoRoles.bots.includes(role.id)) return message.util!.send('This role is not on the bots autorole list.')
 
                this.client.settings.set(message.guild, 'autoRoles.bots', autoRoles.bots.filter(ar => ar !== role.id))
                return message.util!.send('Successfully removed role from the bot autorole list.')
            }
        },

        'all': async (add: boolean) => {
            add ?
            () => {
                if (!autoRoles.all || autoRoles.all.length === 0) {
                    this.client.settings.set(message.guild, 'autoRoles.all', [role.id])
                    return message.util!.send('Successfully added a new autorole for all users.')
                }
                if (autoRoles.all.includes(role.id)) return message.util!.send('This role is already on the autorole list for all users.')

                autoRoles.all.push(role.id)
                this.client.settings.set(message.guild, 'autoROles.all', autoRoles.all)
                
                return message.util!.send('Successfully added the new autorole for all users')
            } :
            () => {
                if (!autoRoles.all || autoRoles.all.length === 0) return message.util!.send('There are no autoroles for specifically all users')
                if (!autoRoles.all.includes(role.id)) return message.util!.send('This role is not on the autorole list for all users.')
 
                this.client.settings.set(message.guild, 'autoRoles.all', autoRoles.all.filter(ar => ar !== role.id))
                return message.util!.send('Successfully removed role from the list for all users.')
            }
        }
    }

    return manageAutoRole[target].call(add)
}

export function createWelcomeMessage(member: GuildMember, content: string): string {
    return content
        .replaceAll('{user}', `${member}`)
        .replaceAll('{userName}', `${member.user.username}`)
        .replaceAll('{nick}', member.nickname ? member.nickname : member.displayName)
        .replaceAll('{server}', member.guild.name)
        .replaceAll('{time}', `${moment(member.joinedAt).utcOffset(1).format('YYYY/MM/DD HH:mm:ss')}`)

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

    if (!addEmbed) return (await feedChannel.send(`${streamer.pings ? streamer.pings.join(', ') : ''} ` + feedMessage)).suppressEmbeds(true)
    else {
        return await feedChannel.send(`${streamer.pings ? streamer.pings.join(', ') : ''}\n` + feedMessage.replace('-embed', '') + ' ', {
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
    .catch(void 0)

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
        .catch(void 0)

        if (findStream) return findStream
        return null
}

export async function _GetAnimeSFW(category: string): Promise<any> {
    return await axios.get(`https://api.waifu.pics/sfw/${category}`, { 'method': 'GET' })
        .then(res => res.data)
        .catch(null)
}

export async function _GetApexPlayer(platform: string, name: string): Promise<any> {
    if (platform === 'pc') platform = 'origin'
    if (platform === 'xbox') platform = 'xbl'
    
    const player = await axios.get(`https://public-api.tracker.gg/v2/apex/standard/profile/${platform}/${name}`, {
        'headers': {
            'TRN-Api-Key': apexAPIkey
        },
        'method': 'GET'
    })
    .then(res => res.data.data)
    .catch(void 0)

    if (player) return player
    return null
}

export async function _GetTwitterUser(twitterUsername: string): Promise<any> {
    const user = await axios.get(`https://api.twitter.com/2/users/by/username/${twitterUsername}?user.fields=pinned_tweet_id,description&expansions=pinned_tweet_id&tweet.fields=created_at`, {
        'headers': {
            'Authorization': `Bearer ${twitterToken}`
        },
        'method': 'GET'
    })
    .then(res => res.data)
    .catch(void 0)

    console.log(user.data)
    console.log(user.includes.tweets)

    if (user) return user
    return null
}

export async function _GetUserLatestPosts(twitterUserID: string): Promise<any> {
    const timeline = await axios.get(`https://api.twitter.com/2/users/${twitterUserID}/tweets?&expansions=attachments.media_keys,in_reply_to_user_id&media.fields=media_key,url`, {
        'headers': {
            'Authorization': `Bearer ${twitterToken}`
        },
        'method': 'GET'
    })
    .then(res => res.data)
    .catch(void 0)
    
    if (timeline) return timeline
    return null
}