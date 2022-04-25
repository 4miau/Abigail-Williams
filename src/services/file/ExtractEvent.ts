import fs from 'fs'

import Service from '../../modules/Service'

export default class ExtractEvent extends Service {
    public constructor() {
        super('extractevent', {
            category: 'File'
        })
    }

    exec(file: string): string {
        const f = fs.readFileSync(file, { encoding: 'utf8' })
        return f.substring(f.indexOf('event:') + 8, f.indexOf('category:') - 1).trim().replace('\'', '').replace(',', '').toLowerCase()
    }
}