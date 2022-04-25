import { envs } from '../../client/Components'
import Service from '../../modules/Service'
import { rawgUri } from './GameConstants'

export default class _GetGameInfo extends Service {
    public constructor() {
        super('getgameinfo', {
            category: 'Games'
        })
    }

    async exec(gameID: string): Promise<any> {
        const obj: any = {
            method: 'GET',
            url: [rawgUri, 'games', gameID].join('/'),
            params: { 'key': envs.rawgAPIKey },
            headers: { 'User-Agent': 'Abigail Williams' }
        }

        this.setConfig(obj)

        const gameData = await this.client.apiManager.call()
        
        this.client.apiManager.resetConfig()
        return gameData
    }

    private setConfig(obj: any) {
        this.client.apiManager.config.method = obj.method
        this.client.apiManager.config.url = obj.url
        this.client.apiManager.config.params = obj.params
        this.client.apiManager.config.headers = obj.headers
    }
}