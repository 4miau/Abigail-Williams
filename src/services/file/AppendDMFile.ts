import { Message } from 'discord.js'
import fs from 'fs'
import moment from 'moment'
import { join } from 'path'

import Service from '../../modules/Service'
import { dmsDir } from './FileConstants'

export default class AppendDMFile extends Service {
    public constructor() {
        super('appenddmfile', {
            category: 'File'
        })
    }

    exec(message: Message): void {
        if (this.client.isOwner(message.author.id)) return

        fs.readdir(dmsDir, (err) => {
            err ? this.client.logger.log('ERROR', `Error Message: ${err}`) : void 0

            fs.appendFile(join(dmsDir, `${message.author.tag}`),
                `[${moment(message.createdAt).format('YYYY/MM/DD HH:mm:ss')}] ${message.author.tag} (${message.author.id}) : ${message.content}\n`,
                _ => void 0
            )
        })
    }
}