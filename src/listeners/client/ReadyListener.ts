import { Listener } from 'discord-akairo'
import { TextChannel, Message } from 'discord.js';

import { Giveaways } from '../../models/Giveaways';
import GiveawayManager from '../../structures/GiveawayManager'
import { postMessage, _GetUserByName } from '../../util/Functions';

export default class ReadyListener extends Listener {
    public constructor() {
        super('ready', {
            emitter: 'client',
            event: 'ready',
            category: 'client'
        })
    }

    public async exec(): Promise<void> {
        this.client.logger.log('INFO', `${this.client.user.tag} has successfully connected.`)

        const giveawayRepo = this.client.db.getRepository(Giveaways)

        setInterval(async () => {
            const giveaways: Giveaways[] = await giveawayRepo.find()
            giveaways.filter(g => g.end <= Date.now()).map(async g => {
                const msg = await (this.client.channels.cache.get(g.channel) as TextChannel).fetch()
                    .catch(() => void 0)
                
                if (!msg) return giveawayRepo.delete(g)

                GiveawayManager.end(giveawayRepo, msg)
            })
        }, 3e5)

        setInterval(async () => {
            this.client.guilds.cache.forEach(async guild => {
                const streamers: { name: string, message: string, pings: string[] , posted: boolean }[] = this.client.settings.get(guild, 'twitch.twitch-streamers', [])
                if (streamers) {
                    for (const streamer of streamers) {
                        const isLive: boolean = await _GetUserByName(streamer.name).then(user => user.is_live)
                            
                        if (isLive && !streamer.posted) {
                            const feedChannelID = this.client.settings.get(guild, 'twitch.twitch-feedchannel', '')

                            if (feedChannelID) {
                                postMessage(guild, feedChannelID, streamer)
                                streamer.posted = true
                            }
                        }
                        if (streamer.posted && await _GetUserByName(streamer.name).then(streamer => !streamer.is_live)) streamer.posted = false
                    }
                }
                
                await this.client.settings.set(guild, 'twitch.twitch-streamers', streamers)
            })
        }, 6e5)
    }
}


//6e5 is default