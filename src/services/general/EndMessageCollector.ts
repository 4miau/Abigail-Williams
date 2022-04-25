import { MessageCollector } from 'discord.js'

import Service from '../../modules/Service'

export default class EndMessageCollector extends Service {
    public constructor() {
        super('endmessagecollector', {
            category: 'General'
        })
    }

    exec(collectors: MessageCollector | MessageCollector[]): void {
        if (!(collectors instanceof Array)) collectors.stop()
        else collectors.forEach(c => c.stop())
    }
}