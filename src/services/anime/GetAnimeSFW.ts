import Service from '../../modules/Service'
import { apiUri } from './AnimeConstants'

export default class _GetAnimeSFW extends Service {
    public constructor() {
        super('getanimesfw', {
            category: 'Anime'
        })
    }

    async exec(category: string) {
        const obj: any = {
            method: 'GET',
            url: [apiUri, category].join('/')
        }

        this.setConfig(obj)
        const animeResult = await this.client.apiManager.call()
        this.client.apiManager.resetConfig()

        return animeResult
    }

    private setConfig(obj: any) {
        this.client.apiManager.config.method = obj.GET
        this.client.apiManager.config.url = obj.url
    }
}