import ripemd160 from 'ripemd160'

import Service from '../../modules/Service'

export default class GenerateHash extends Service {
    public constructor() {
        super('generatehash', {
            category: 'General'
        })
    }

    exec(str: string): string {
        return new ripemd160().update(str).digest('base64')
    }
}