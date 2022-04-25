import { TextChannel, DMChannel, Message } from 'discord.js'

import Service from '../../modules/Service'

export default class CloseThreadMessage extends Service {
    public constructor() {
        super('closethreadmessage', {
            category: 'Threads'
        })
    }

    async exec(channels: (TextChannel | DMChannel)[], m: Message): Promise<void> {
        channels.forEach((c: TextChannel | DMChannel) => {
            if (!c) return
            c.send(`This thread has been closed by ${m.author.tag} (${m.author.id})`) 
        })
    }
}