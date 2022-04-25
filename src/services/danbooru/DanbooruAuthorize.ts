import { envs } from '../../client/Components'
import { danbooruUri } from './DanbooruConstants'
import Service from '../../modules/Service'

export default class _DanbooruAuthorize extends Service {
    public constructor() {
        super('danbooruauthorize', {
            category: 'Danbooru'
        })
    }

    async exec(): Promise<any> {
        const obj: any = {
            method: 'GET',
            url: [danbooruUri, 'profile.json'].join('/'),
            params: {
                login: envs.danbooruUsername,
                api_key: envs.danbooruAPIKey
            }
        }

        this.setConfig(obj)
        
        const result = await this.client.apiManager.call()

        this.client.apiManager.resetConfig()
        return result
    }

    private setConfig(obj: any) {
        this.client.apiManager.config.method = obj.method
        this.client.apiManager.config.url = obj.url
        this.client.apiManager.config.params = obj.params
    }
}