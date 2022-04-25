import { Message, TextChannel, User } from 'discord.js'

import Service from '../../modules/Service'

export default class GetInput extends Service {
    public constructor() {
        super('getinput', {
            category: 'General'
        })
    }

    async exec(req: string, chnl: TextChannel, userID: string = null, del: boolean = false): Promise<string> {
        const message = await chnl.send(req)

        const filter = userID ? (m: Message) => { return m.author.id === userID } : null

        try { 
            const result = (await chnl.awaitMessages({ max: 1, time: 3e5, filter: filter || void 0 })).first().content
            del ? setTimeout(() => message.delete(), 3000) : void 0
            return result
        }
        catch { return null }
    }
}