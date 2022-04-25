import { Message } from 'discord.js'

import Service from '../../modules/Service'

export default class GetMessageResponse extends Service {
    public constructor() {
        super('getmessageresponse', {
            category: 'General'
        })
    }

    async exec(msg: Message): Promise<string> {
        const filter = (m: Message) => m.author.id === msg.author.id
        return await msg.channel.awaitMessages({ filter: filter, max: 1, time: 3e4}).then(col => col.first().content).catch(void 0)
    }
}