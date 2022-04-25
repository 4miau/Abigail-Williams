import fs from 'fs'

import Service from '../../modules/Service'

export default class FileCount extends Service {
    public constructor() {
        super('filecount', {
            category: 'File'
        })
    }

    exec(dir: string): number {
        return fs.readdirSync(dir).length || 0
    }
}