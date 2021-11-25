import { Mal } from 'node-myanimelist'

import { envs } from '../../client/Components'

export async function _MALLogin() { return Mal.auth(envs.MALClientID).Unstable.login(envs.MALUser, envs.MALPass) }

export async function _MALQuery(type: string, query: string, media: string = null) {
    const account = await _MALLogin()

    switch(type) {
        case 'anime': {
            const animeResults = await account.anime.search(query, Mal.Anime.fields().all(), 10).call()

            if (media) return animeResults.data.filter(a => a.node.media_type === media)
            else return animeResults.data
        }
        case 'manga': {
            const mangaResults = await account.manga.search(query, Mal.Manga.fields().all(), 10).call()

            return mangaResults.data
        }
    }
}