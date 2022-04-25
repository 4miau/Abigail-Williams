import { Mal } from 'node-myanimelist'
import Service from '../../modules/Service'

export default class _MalQuery extends Service {
    public constructor() {
        super('malquery', {
            category: 'MAL'
        })
    }

    async exec(type: string, query: string, media: string = null) {
        const account: Mal.MalAcount = await this.handler.modules.get('mallogin').exec()
        if (!account) return null

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
}