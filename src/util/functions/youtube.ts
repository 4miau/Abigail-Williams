import axios from 'axios'

import { envs } from '../../client/Components'

export async function _GetYTToken() {
    return 'pizza'
}

export async function _GetCreator(search: string): Promise<any> {
    const results = await axios.get(`https://www.googleapis.com/youtube/v3/channels?forUsername=${search}&maxResults=10&key=${envs.youtubeAPIKey}`)
        .then(res => res.data)

    return results ? results : null
}

export async function _ExpGetCreator(url: string): Promise<any> {
}

export async function _GetLatestVideo(creator: string): Promise<any> {
    const results = await axios.get('', {})
}

//https://www.googleapis.com/youtube/v3/videos

//TODO: WIP