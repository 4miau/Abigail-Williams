import { envs } from '../../client/Components'
import Service from '../../modules/Service'
import { apexUri } from './GameConstants'

export default class _GetApexUID extends Service {
    public constructor() {
        super('getapexuid', {
            category: 'Games'
        })
    }

    async exec(platform: string, name: string): Promise<any> {
        if (platform === 'xbox') platform = 'X1'
        if (platform === 'psn') platform = 'PS4'

        const obj: any = {
            method: 'GET',
            params: { 'player': name, 'platform': platform.toUpperCase(), 'auth': envs.ApexAPIkey },
            url: [apexUri, 'nametouid'].join('/')
        }

        this.setConfig(obj)
        const uid = await this.client.apiManager.call().then(res => res.uid)
        this.client.apiManager.resetConfig()

        return uid ? uid : null
    }

    private setConfig(obj: any) {
        this.client.apiManager.config.method = obj.method
        this.client.apiManager.config.params = obj.params
        this.client.apiManager.config.url = obj.url
    }
}