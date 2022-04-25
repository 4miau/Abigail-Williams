import { TextChannel } from 'discord.js'

import Giveaways, { IGiveaway } from '../../models/Giveaways'
import Service from '../../modules/Service'
import GiveawayManager from '../../structures/GiveawayManager'

export default class SetGiveaways extends Service {
    public constructor() {
        super('setgiveaways', {
            category: 'GuildAsync'
        })
    }

    async exec(): Promise<void> {
        const giveaways: IGiveaway[] = await Giveaways.find()
        giveaways.filter(g => g.end <= Date.now()).forEach(async g => {
            const msg = await (this.client.channels.cache.get(g.channel) as TextChannel).fetch().catch(() => void 0)
    
            if (!msg) return g.delete()
            GiveawayManager.end(msg)
        })
    }
}