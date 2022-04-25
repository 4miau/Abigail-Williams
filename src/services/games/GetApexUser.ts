import { envs } from '../../client/Components'
import Service from '../../modules/Service'
import { apexUri } from './GameConstants'

export default class _GetApexUser extends Service {
    public constructor() {
        super('getapexuser', {
            category: 'Games'
        })
    }
    
    async exec(platform: string, uid: string): Promise<any> {
        if (platform === 'xbox') platform = 'X1'
        if (platform === 'psn') platform = 'PS4'

        const obj: any = {
            method: 'GET',
            params: { 'uid': uid, 'platform': platform.toUpperCase(), 'auth': envs.ApexAPIkey },
            url: [apexUri, 'bridge'].join('/')
        }

        this.setConfig(obj)
        const apexUser = this.client.apiManager.call()
        this.client.apiManager.resetConfig()
        return apexUser ? apexUser : null
    }

    private setConfig(obj: any) {
        this.client.apiManager.config.method = obj.method
        this.client.apiManager.config.params = obj.params
        this.client.apiManager.config.url = obj.url   
    }
}