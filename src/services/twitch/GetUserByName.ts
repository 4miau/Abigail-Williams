import { envs } from '../../client/Components'
import Service from '../../modules/Service'
import { twitchUri, twitchUri2 } from './TwitchConstants'

export default class _GetUserByName extends Service {
    public constructor() {
        super('getuserbyname', {
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
        obj.url = [twitchUri2, 'search', 'channels'].join('/')
        obj.headers = { 'client-id': envs.twitchClientID, 'Authorization': ['Bearer', token].join(' ') }
        obj.params = { query: streamerName }

        this.setConfig(obj)

        const user = await this.client.apiManager.call()
            .then(res => res.data.find((u: any) => u.broadcaster_login === streamerName))
            .catch(void 0)

        this.client.apiManager.resetConfig()
        return user
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