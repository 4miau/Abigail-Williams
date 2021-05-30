import { Listener } from 'discord-akairo'
import { TextChannel } from 'discord.js';
import BotClient from '../../client/BotClient';

import { BotStatus } from '../../models/BotStatus';
import { Giveaways } from '../../models/Giveaways';
import GiveawayManager from '../../structures/GiveawayManager'
import Starboard from '../../structures/StarboardManager';
import { createFileDirs, postMessage, _GetUserByName } from '../../util/Functions';

export default class Ready extends Listener {
    public constructor() {
        super('ready', {
            emitter: 'client',
            event: 'ready',
            category: 'client'
        })
    }

    public async exec(): Promise<void> {
        this.client.logger.log('INFO', `${this.client.user.tag} has successfully connected.`)
        this.client.manager.init(this.client.user.id)
        
        //Create Logging File Directories
        createFileDirs()

        //Restart status
        const botStatusRepo = this.client.db.getRepository(BotStatus)
        const currBotStatus = await botStatusRepo.findOne({ id: 1 })

        if (currBotStatus && currBotStatus.type) {
            const startUpChannel = this.client.channels.cache.get('542852359085096970') as TextChannel
            const startUpMessage = await startUpChannel.send('I am now up and running.')

            currBotStatus.type === 'status' ? 
                await this.client.commandHandler.findCommand('status')
                    .exec(startUpMessage, { status: currBotStatus.activityType, statusMsg: currBotStatus.status, twitchURL: currBotStatus.url ? currBotStatus.url : void 0 }) 
                :
                await this.client.commandHandler.findCommand('activity')
                    .exec(startUpMessage, { activityType: currBotStatus.activityType, activityMsg: currBotStatus.status, twitchURL: currBotStatus.url ? currBotStatus.url : void 0 })

                startUpMessage.delete({ timeout: 3000 })
        }

        //Set a new starboard for every server without one on start-up
        for (const guild of this.client.guilds.cache.map(g => g)) {
            if (!this.client.starboards.has(guild.id)) {
                const starboard = new Starboard(this.client as BotClient, guild)
                this.client.starboards.set(guild.id, starboard)
            }
        }
        
        /* [Interval Subfunctions (async)] */
        //Giveaway Subfunction
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

        //Twitch Notifications Subfunction
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