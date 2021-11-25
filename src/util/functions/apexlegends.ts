import axios from 'axios'

import { envs } from '../../client/Components'

export function emojifyRank(rank: string): string {
    if (rank.includes('Bronze')) return '<:1Bronze:842770590993350687>'
    else if (rank.includes('Silver')) return '<:2Silver:842770591614631966>'
    else if (rank.includes('Gold')) return '<:3Gold:842770591798394900>'
    else if (rank.includes('Platinum')) return '<:4Platinum:842770592424001586>'
    else if (rank.includes('Diamond')) return '<:5Diamond:842770592411025448>'
    else if (rank.includes('Master')) return '<:6Master:842770593027850260>'
    else if (rank.includes('Apex Predator')) return '<:7ApexPredator:842770592553238548>'
    else return null
}

export async function _GetApexUID(platform: string, name: string): Promise<any> {
    if (platform === 'xbox') platform = 'X1'
    if (platform === 'psn') platform = 'PS4'

    try {
        const UID = await axios.get(`https://api.mozambiquehe.re/nametouid?player=${name}&platform=${platform.toUpperCase()}&auth=${envs.ApexAPIkey}`)
            .then(res => res.data.uid)

        return UID ? UID : null
    } catch {
        return null
    }
}

export async function _GetApexUser(platform: string, uid: string): Promise<any> {
    if (platform === 'xbox') platform = 'X1'
    if (platform === 'psn') platform = 'PS4'

    try {
        const userData = await axios.get(`https://api.mozambiquehe.re/bridge?platform=${platform.toUpperCase()}&uid=${uid}&auth=${envs.ApexAPIkey}`)
            .then(res => res.data)

        return userData ? userData : null
    } catch {
        return null
    }
}