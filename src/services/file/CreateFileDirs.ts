import fs from 'fs'

import Service from '../../modules/Service'
import { bulkLogsDir, dmsDir, threadsDir, bufferDir, captchasDir } from './FileConstants'

export default class CreateFileDirs extends Service {
    public constructor() {
        super('createfiledirs', {
            category: 'Files'
        })
    }

    exec(): void {
        fs.mkdir(bulkLogsDir, () => void 0)
        fs.mkdir(dmsDir, () => void 0)
        fs.mkdir(threadsDir, () => void 0)
        fs.mkdir(bufferDir, () => void 0)
        fs.mkdir(captchasDir, () => void 0)
    }
}