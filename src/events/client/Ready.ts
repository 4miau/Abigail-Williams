import { Listener } from 'discord-akairo'
import { TextChannel } from 'discord.js'
import Abby from '../../client/Abby'

import BotStatus from '../../models/BotStatus'
import Giveaways, { IGiveaway } from '../../models/Giveaways'
import GiveawayManager from '../../structures/GiveawayManager'
import Starboard from '../../structures/StarboardManager'
import { createFileDirs } from '../../util/functions/fileaccess'
import { postMessage } from '../../util/functions/twitch'
import { _GetUserByName } from '../../util/functions/twitch'

export default class Ready extends Listener {
    public constructor() {
        super('ready', {
            emitter: 'client',
            event: 'ready',
            category: 'client'
        })
    }

    public async exec(): Promise<void> {
        this.client.logger.log('INFO', `${this.client.user.tag} has successfully connected.\nShard Count: ${this.client.ws.shards.size}`)
        this.client.users.resolve(this.client.ownerID as string).createDM().then(async dm => {
            const online = await dm.send('I am now online, master.')
            setTimeout(() => online.delete(), 10000)
        })

        this.setAbbyPaths()
        this.setBotStatus()

        await this.fetchMessageReacts()
        this.client.queue.add(this.client.threadManager._init())
        this.client.queue.add(this.setupStarboard())

        /* [Interval Subfunctions (async)] */
        setInterval(async () => { this.client.queue.add(this.setPremium()) }, 6e4)
        setInterval(async () => { this.client.queue.add(this.setGiveaways()) }, 3e5)
        setInterval(async () => { this.client.queue.add(this.twitchNotifications()) }, 6e5)
    }

    private setAbbyPaths() {
        this.client.abbyHomeServer = this.client.guilds.resolve('542751800739233798')
        this.client.abbyLog = this.client.channels.resolve('842906441458384926') as TextChannel
        this.client.abbyReport = this.client.channels.resolve('849744056866963467') as TextChannel
        this.client.queue.add(createFileDirs())
    }

    private async setPremium() {
        this.client.guilds.cache.forEach(async g => {
            if (g.members.cache.some(m => (this.client.settings.get('global', 'premium-users', [])?.includes(m.user.id)))) // && !this.client.isOwner(m) 
                this.client.settings.set(g, 'has-premium', true)
            else this.client.settings.set(g, 'has-premium', false)
        })
    }

    private async fetchMessageReacts() {
        for (const guild of this.client.guilds.cache.values()) {
            const roleGroups: RoleGroup[] = this.client.settings.get(guild, 'reaction.role-groups', [])
            if (roleGroups.arrayEmpty()) return
            if (roleGroups.some(rg => !rg.messages.arrayEmpty())) {
                const filteredGroups = roleGroups.filter(rg => !rg.messages.arrayEmpty())
                filteredGroups.forEach(fg => {
                    fg.messages.forEach(async (msgArr) => {
                        const channel = guild.channels.resolve(msgArr.channel) as TextChannel
                        if (!channel) return
                        await channel.messages.fetch(msgArr.message, { cache: true, force: true })
                    })
                })
            }
        }
    }

    
    private async setBotStatus() {
        const currBotStatus = await BotStatus.findOne({ id: 1 })

        if (currBotStatus && currBotStatus.presenceType) {
            const startUpChannel = this.client.channels.cache.get('842906441458384926') as TextChannel
            const startUpMessage = await startUpChannel.send('I am now up and running.')

            currBotStatus.presenceType === 'status' ? 
                await this.client.commandHandler.findCommand('status')
                    .exec(
                        startUpMessage, { 
                            status: currBotStatus.presenceMode, 
                            statusMsg: currBotStatus.presenceMessage, 
                            twitchURL: currBotStatus.url ? currBotStatus.url : void 0
                        }
                    ) 
                :
                await this.client.commandHandler.findCommand('activity')
                    .exec(
                        startUpMessage, { 
                            activityType: currBotStatus.presenceMode, 
                            activityMsg: currBotStatus.presenceMessage, 
                            twitchURL: currBotStatus.url ? currBotStatus.url : void 0
                        }
                    )

                setTimeout(() => startUpMessage.delete(), 3000)
        }
    }

    private async setupStarboard() {
        for (const guild of this.client.guilds.cache.map(g => g)) {
            if (!this.client.starboards.has(guild.id)) {
                const starboard = new Starboard(this.client as Abby, guild)
                this.client.starboards.set(guild.id, starboard)
            }
        }
    }

    private async setGiveaways() {
        const giveaways: IGiveaway[] = await Giveaways.find()
        giveaways.filter(g => g.end <= Date.now()).forEach(async g => {
            const msg = await (this.client.channels.cache.get(g.channel) as TextChannel).fetch().catch(() => void 0)

            if (!msg) return g.delete()
            GiveawayManager.end(msg)
        })
    }

    private async twitchNotifications() {
        this.client.guilds.cache.forEach(async guild => {
            const streamers: { name: string, message: string, pings: string[] , posted: boolean }[] = this.client.settings.get(guild, 'twitch.twitch-streamers', [])
            if (streamers.arrayEmpty()) return

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
            
            await this.client.settings.set(guild, 'twitch.twitch-streamers', streamers)
        })
    }

    private async youtubeNotifications() {
        //TODO: Post new youtube videos
    }
}