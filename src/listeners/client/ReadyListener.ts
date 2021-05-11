import { Listener } from 'discord-akairo'
import winston from 'winston'

import { _GetUser } from '../../utils/Functions';

export default class ReadyListener extends Listener {
    public constructor() {
        super('ready', {
            emitter: 'client',
            event: 'ready',
            category: 'client'
        })
    }

    public async exec(): Promise<void> {
        const logger = winston.createLogger({
            transports: [
                new winston.transports.Console(),
                new winston.transports.File({ 'filename': 'winston-log' })
            ]
        })

        logger.log('info', `${this.client.user.tag} has successfully connected.`)

        //Twitch Configuration Settings if non-existent
        ;(async () => {
            for (const guild of this.client.guilds.cache) {
                const twitchMessage = this.client.settings.get(guild[1], 'twitch.twitch-message', '')
                if (!twitchMessage) this.client.settings.set(guild[1], 'twitch.twitch-message', `{streamer} has gone live! {link}`)
                else continue
            }
        })() 
        //

        setInterval(async () => {
            this.client.guilds.cache.forEach(guild => {
                const streamers: string[] = this.client.settings.get(guild, 'twitch.twitch-users', [])
                if (streamers) {
                    streamers.forEach(async streamer => {
                        return await _GetUser(streamer)
                            .then(user => {
                                logger.log('info', user.broadcaster_login + ': ' + user.is_live)
                                return user.is_live
                            })
                    })
                }
            });
        }, 6e5)
    }
}

/*
import { Message } from 'discord.js'

import { BotStatus } from '../../models/BotStatus'

        const statusRepo = this.client.db.getRepository(BotStatus)
        if (await statusRepo.find().then(bsArr => bsArr.length > 0)) {
            const botstatus = await statusRepo.find()
                .then(bsArr => bsArr.find(bs => bs.id))
            let decoyMessage: Message
            
            botstatus.type === 'status' ?
                this.client.commandHandler.runCommand(decoyMessage, this.client.commandHandler.findCommand('status'), [
                   botstatus.activityType,
                    botstatus.status,
                    botstatus.url
                ])
                : 
                this.client.commandHandler.runCommand(decoyMessage, this.client.commandHandler.findCommand('activity'), [
                    botstatus.activityType,
                    botstatus.status,
                    botstatus.url
                ])

        }
*/