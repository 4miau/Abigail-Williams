import Service from '../../modules/Service'
import { avatarUri } from './GuildAsyncConstants'

export default class GetAvatar extends Service {
    public constructor() {
        super('getavatar', {
            category: 'GuildAsync'
        })
    }

    async exec(userID: string): Promise<any> {
        const obj: any = {
            method: 'GET',
            url: [avatarUri, userID].join('/')
        }

        this.setConfig(obj)

        const res = await this.client.apiManager.call()
        this.client.apiManager.resetConfig()
        return res
    }

    private setConfig(obj: any) {
        this.client.apiManager.config.method = obj.method
        this.client.apiManager.config.url = obj.url
    }
}