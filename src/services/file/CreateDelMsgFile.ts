import { Snowflake, Message, Collection } from 'discord.js'
import fs from 'fs'
import moment from 'moment'
import { join } from 'path'

import Service from '../../modules/Service'
import { bulkLogsDir } from './FileConstants'

export default class CreateDelMsgFile extends Service {
    public constructor() {
        super('createdelmsgfile', {
            category: 'File'
        })
    }

    exec(deletedMessages: Collection<Snowflake, Message>): void {
        fs.readdir(bulkLogsDir, (_, files) => {
            const noOfLogs: number = files.length + 1
    
            fs.writeFile(join(bulkLogsDir, `bulk-log [${noOfLogs}]`), deletedMessages.map(dm => {
                return `[${moment(dm.createdAt).format('YYYY/MM/DD HH:mm:ss')}] ${dm.author.tag} (${dm.author.id}) : ${dm.content}`
            }).join('\n'), error => error)
        })
    }
}