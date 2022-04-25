import Service from '../../modules/Service'

export default class ParseUri extends Service {
    public constructor() {
        super('parseuri', {
            category: 'General'
        })
    }

    exec(str: string): boolean {
        let url: URL

        try {  url = new URL(str) }
        catch { return false }
    
        return url.protocol === 'http:' || url.protocol === 'https:'
    }
}