import glob from 'glob'
import { join } from 'path'

import Service from '../../modules/Service'
import { src } from './FileConstants'

export default class FindFile extends Service {
    public constructor() {
        super('findfile', {
            category: 'File'
        })
    }

    async exec(file: string, type: string): Promise<string> {
        const errorMsg = 'Unable to find the file'

        const typeHandler = {
            'command': async () => {
                const query = glob.sync(join(src, 'commands/**/*'), { sync: false })
                return query.find(c => c.split('/').findLast(f => f.endsWith('.js'))?.caseCompare(`${file}.js`)) || errorMsg
            },
            'event': async () => {
                const query = glob.sync(join(src, 'events/**/*'), { sync: false })
                return query.find(c => c.split('/').findLast(f => f.endsWith('.js'))?.caseCompare(`${file}.js`)) || errorMsg
            },
            'inhibitor': () => {
                const query = glob.sync(join(src, 'inhibitors/**/*'), { sync: false })
                return query.find(c => c.split('/').findLast(f => f.endsWith('.js'))?.caseCompare(`${file}.js`)) || errorMsg
            },
            'service': () => {
                const query = glob.sync(join(src, 'services/**/*'), { sync: false })
                return query.find(c => c.split('/').findLast(f => f.endsWith('.js'))?.caseCompare(`${file}.js`)) || errorMsg
            }
        }

        return typeHandler[type].call()
    }
}