import { Message } from 'discord.js'

import { IThread } from '../../models/Threads'
import Service from '../../modules/Service'

export default class UpdateThreadData extends Service {
    public constructor() {
        super('updatethreaddata', {
            category: 'Threads'
        })
    }

    exec(thread: IThread, m: Message): void {
        thread.closedBy = m.author.id
        thread.updateOne(thread)
    }
}