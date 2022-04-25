import Service from '../../modules/Service'
import { quoteApiUri } from './AnimeConstants'

export default class GetAnimeQuote extends Service {
    public constructor() {
        super('getanimequote', {
            category: 'Anime'
        })
    }

    async exec(): Promise<any> {
        const obj: any = {
            method: 'GET',
            url: [quoteApiUri, 'random'].join('/')
        }

        this.setConfig(obj)
        const quoteObj = await this.client.apiManager.call()
        this.client.apiManager.resetConfig()
        return quoteObj
    }

    private setConfig(obj: any) {
        this.client.apiManager.config.method = obj.method
        this.client.apiManager.config.url = obj.url
    }
}