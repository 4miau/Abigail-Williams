import { envs } from '../../client/Components'
import Service from '../../modules/Service'
import { twitchUri, twitchUri2 } from './TwitchConstants'

export default class UpdateStreamers extends Service {
    public constructor() {
        super('updatestreamers', {
            category: 'Twitch'
        })
    }

    async exec(): Promise<any> {
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
        this.client.apiManager.resetConfig()

        for(const guild of this.client.guilds.cache.values()) {
            let streamers: Streamer[] = this.client.settings.get(guild, 'streamers', [])

            if (!streamers.arrayEmpty()) {
                obj.method = 'GET'
                obj.url = [twitchUri2, 'users'].join('/')
                obj.headers = { 'client-id': envs.twitchClientID, 'Authorization': ['Bearer', token].join(' ') }

                streamers.reduceRight((_, s, i) => {
                    obj.params = { id: s.id }
                    this.setConfig(obj)

                    this.client.apiManager.call()
                        .then(data => {
                            if (!data[0]) streamers.splice(i, 1)
                            else if (s.name !== data[0].login) _.name = data[0].login
                        })
                        .catch(void 0)

                    return s
                })

                this.client.apiManager.resetConfig()
                await this.client.settings.set(guild, 'streamers', streamers)
            }
        }
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