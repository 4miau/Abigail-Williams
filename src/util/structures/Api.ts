import axios from 'axios'
import { AxiosRequestConfig } from 'axios'
import { AkairoClient as Abby } from 'discord-akairo'

export class APIRequest<T> {
    client: Abby
    config: AxiosRequestConfig

    constructor(client: Abby, config: AxiosRequestConfig) {
        this.client = client
        this.config = config
    }

    async call(): Promise<T> {
        return new Promise((res, rej) => {
            this.client.queue.add(
                axios(this.config)
                    .then(r => res(r.data))
                    .catch(err => rej(err))
            )
        })
    }

    getUrl(): string {
        return axios.getUri(this.config)
    }

    resetConfig(config: AxiosRequestConfig = { method: 'GET', url: '', params: {}, headers: {} }): AxiosRequestConfig {
        return this.config = config
    }
}

export default APIRequest

/*
Call Template:

const config: AxiosRequestConfig = {
    method: 'POST',
    url: [apiURL, 'token'].join('/'),
    params: getQueryParams({
        client_id: clientID,
        client_secret: clientSecret,
        grant_type: 'refresh_token',
        refresh_token: refreshToken
    })
}

const request = new TwitchRequest(config)
const data: any = await request.call()
*/