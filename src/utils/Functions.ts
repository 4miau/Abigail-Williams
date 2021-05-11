import { Guild, GuildMember } from "discord.js"
import axios from 'axios'

import { twitchClientID, twitchClientSecret } from "../Config";

export function getRandomInt(length: number) {
    return Math.floor(Math.random() * length)
}

export function getRandomIntRange(min: number, max: number) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * ((max - min) + 1))
}

export function splitArrayNth(stArr: string[], splitter: number): string[] {
    for(var i = 0; i < stArr.length; i++) {
        if (i % splitter) {
            stArr[i] += '\n'
        }

        return stArr
    }
}

export function getJoinPosition(member: GuildMember, guild: Guild): number {
    if (!member || !guild) return

    const memberIDArr = guild.members.cache.sort((a: any, b: any) =>  a.joinedAt - b.joinedAt).keyArray()
    return (memberIDArr.findIndex(id => id === member.id) + 1)
}

export async function _GetUser(streamerName: string): Promise<any> {
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


/*
            const token = await axios.post(`https://id.twitch.tv/oauth2/token?client_id=${twitchClientID}&client_secret=${twitchClientSecret}&grant_type=client_credentials`)
            .then(res => res.data.access_token)
            .catch(void 0)

            const findUser = await axios.get(`https://api.twitch.tv/helix/search/channels?query=${streamer}`, {
                'headers': {
                    'client-id': twitchClientID,
                    'Authorization': `Bearer ${token}`
                },
                'method': 'GET'
            })
            .then(async res => {
                const user = res.data.data.find((user: any) => user.broadcaster_login === streamer)
                if (user) return user
                else return void 0
            })
            .catch(void 0)
*/