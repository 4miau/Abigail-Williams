import { Listener } from 'discord-akairo'

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