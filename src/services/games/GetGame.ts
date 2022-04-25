import { envs } from '../../client/Components'
import Service from '../../modules/Service'
import { rawgUri } from './GameConstants'

export default class _GetGame extends Service {
    public constructor() {
        super('getgame', {
            category: 'Games'
        })
    }

    async exec(query: string): Promise<any> {
        const obj: any = {
            method: 'GET',
            url: [rawgUri, 'games'].join('/'),
            params: { 'search': query, 'page_size': 5, 'key': envs.rawgAPIKey },
            headers: { 'User-Agent': 'Abigail Williams' }
        }

        this.setConfig(obj)

        const games = await this.client.apiManager.call().then(res => res.results)
        this.client.apiManager.resetConfig()
        return games
    }

    private setConfig(obj: any) {
        this.client.apiManager.config.method = obj.method
        this.client.apiManager.config.url = obj.url
        this.client.apiManager.config.params = obj.params
        this.client.apiManager.config.headers = obj.headers
    }
}