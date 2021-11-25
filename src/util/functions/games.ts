import axios from 'axios'
import { envs } from '../../client/Components'

export async function _GetGame(query: string) {
    const games = await axios.get(`https://api.rawg.io/api/games?search=${query}&page_size=5`, {
        'params': { 'key': envs.rawgAPIKey },
        'headers': { 'User-Agent': 'Abigail Williams' }
    })
    .then(res => res.data.results)
    .catch(err => { 
        console.log(err) 
        return void 0
    })

    return games ? games : null
}

export async function _GetGameInfo(gameID: string) {
    const gameData = await axios.get(`https://api.rawg.io/api/games/${gameID}`, {
        'params': { 'key': envs.rawgAPIKey },
        'headers': { 'User-Agent': 'Abigail Williams' }
    })
    .then(res => res.data)
    .catch(err => {
        console.log(err)
        return void 0
    })

    return gameData ? gameData : null
}