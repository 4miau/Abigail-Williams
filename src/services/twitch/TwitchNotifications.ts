import Service from '../../modules/Service'

export default class TwitchNotifications extends Service {
    public constructor() {
        super('twitchnotifications', {
            category: 'Twitch'
        })
    }

    async exec(): Promise<void> {
        const getStreamer = this.handler.modules.get('getuserbyname')
        const postMessage = this.handler.modules.get('posttwitchmessage')
        const updateStreamers = this.handler.modules.get('updatestreamers')

        await updateStreamers.exec()

        this.client.guilds.cache.forEach(async guild => {
            const streamers: Streamer[] = this.client.settings.get(guild, 'streamers', [])
            if (streamers.arrayEmpty()) return
    
            for (const streamer of streamers) {
                const is_live: boolean = await getStreamer.exec(streamer.name)
                    .then((user: any) => user.is_live)
                    .catch((err: any) => {
                        this.client.logger.log('INFO', `Full error: ${err}`)
                        this.client.logger.log('ERROR', 'Failed to check if user is live.')
                    })
    
                if (is_live && !streamer.posted) {
                    const feedChannelID = this.client.settings.get(guild, 'feed-channel', '')
    
                    if (feedChannelID) {
                        await postMessage.exec(guild, feedChannelID, streamer)
                        streamer.posted = true
                    }
                }
                else if (!is_live && streamer.posted) streamer.posted = false
            }
    
            await this.client.settings.set(guild, 'streamers', streamers)
        })
    }
}