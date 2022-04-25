import { Guild, Message } from 'discord.js'

import Service from '../../modules/Service'

export default class GetGuildMessage extends Service {
    public constructor() {
        super('getguildmessage', {
            category: 'GuildAsync'
        })
    }

    async exec(guild: Guild, msg: string): Promise<Message> {
        if (!msg) return null

        for (const channel of guild.channels.cache.values()) {
            if (channel.isText()) {
                try {
                    await new Promise((res, rej) => channel.messages.fetch(msg, { force: false }).then(res).catch(rej))
                    return channel.messages.resolve(msg)
                } catch {
                    continue
                }
            }
        }

        return null
    }
}