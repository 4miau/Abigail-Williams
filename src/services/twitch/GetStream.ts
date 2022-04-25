import { envs } from '../../client/Components'
import Service from '../../modules/Service'
import { twitchUri, twitchUri2 } from './TwitchConstants'

export default class GetStream extends Service {
    public constructor() {
        super('getstream', {
            category: 'Twitch'
        })
    }

    async exec(streamerName: string): Promise<any> {
        const obj: any = { 
            method: 'POST',
            url: [twitchUri, 'token'].join('/'),
            params: {
                client_id: envs.twitchClientID,
                client_secret: envs.twitchClientSecret,
                grant_type: 'client_credentials'
            }
        }

        this.setConfig(obj)
        const token = await this.client.apiManager.call().then(res => res.access_token)

        obj.method = 'GET'
        obj.url = [twitchUri2, 'streams'].join('/')
        obj.params = { user_login: streamerName }
        obj.headers = { 'client-id': envs.twitchClientID, 'Authorization': ['Bearer', token].join(' ') }

        this.setConfig(obj)
        const stream = await this.client.apiManager.call()
            .then(res => res.data[0])
            .catch(void 0)

        this.client.apiManager.resetConfig()
        return stream
    }

    private setConfig(obj: any) {
        const config = this.client.apiManager.config

        if (obj.method) config.method = obj.method
        if (obj.url) config.url = obj.url
        if (obj.params) config.params = obj.params
        if (obj.headers) config.headers = obj.headers

        this.client.apiManager.config = config
    }
}