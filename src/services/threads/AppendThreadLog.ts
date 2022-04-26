import { Message } from 'discord.js'
import fs from 'fs'
import moment from 'moment'
import { join } from 'path'

import { IThread } from '../../models/Thread'
import Service from '../../modules/Service'
import { threadDir } from './ThreadConstants'

export default class AppendThreadLog extends Service {
    public constructor() {
        super('appendthreadlog', {
            category: 'Threads'
        })
    }

    async exec(thread: IThread, msg: Message): Promise<void> {
        const user = this.client.users.resolve(thread.userID)
        const location = join(threadDir, `${user.tag} [${thread.id}]`)

        fs.appendFile(location, 
            `${msg.channel.type !== 'DM' ? `[Staff at ${msg.guild.name}] ` : '' }` + 
            `[${moment(msg.createdAt).format('YYYY/MM/DD HH:mm:ss')}] ${msg.author.tag} (${msg.author.id}) : ${msg.content}\n`,
            _ => void 0
        )
    }
}