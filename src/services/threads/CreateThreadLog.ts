import fs from 'fs'
import { join } from 'path'

import Service from '../../modules/Service'
import { IThread } from '../../models/Threads'
import { threadDir } from './ThreadConstants'

export default class CreateThreadLog extends Service {
    public constructor() {
        super('createthreadlog', {
            category: 'Threads'
        })
    }

    async exec(thread: IThread): Promise<void> {
        const user = this.client.users.resolve(thread.userID)
        const guild = this.client.guilds.resolve(thread.guildID)
        const location = join(threadDir, `${user.tag} [${thread.id}]`)
        
        fs.writeFile(location, `New thread in ${guild.name} (${guild.id}) with ${user.tag}.\n`, _ => void 0)
    }
}