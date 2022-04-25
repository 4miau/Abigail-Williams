import Service from '../../modules/Service'
import { danbooruUri } from './DanbooruConstants'

export default class _GetBooruImages extends Service {
    public constructor() {
        super('getbooruimages', {
            category: 'Danbooru'
        })
    }

    async exec(query: string, amount: number = 150) {
        if (!query) query = null

        const raw = query ? query.replaceAll(' ', '_') : null
        const defaultTags = `&limit=${amount}&order=random&rating=safe`
    
        const obj: any = {
            method: 'GET',
            url: [danbooruUri, 'posts.json'].join('/'),
            params: { tags: raw + defaultTags }
        }

        this.setConfig(obj)
        const images: any[] = await this.client.apiManager.call().then(res => res && (res?.large_file_url || res?.file_url)).catch(() => void 0)
        this.client.apiManager.resetConfig()
        return images.arrayRandom()
    }

    private setConfig(obj: any) {
        this.client.apiManager.config.method = obj.method
        this.client.apiManager.config.url = obj.url
        this.client.apiManager.config.params = obj.params
    }
}