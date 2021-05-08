import { Listener } from 'discord-akairo'
import { Message } from 'discord.js'

import { BotStatus } from '../../models/BotStatus'

export default class ReadyListener extends Listener {
    public constructor() {
        super('ready', {
            emitter: 'client',
            event: 'ready',
            category: 'client'
        })
    }

    public async exec(): Promise<void> {
        console.log(`${this.client.user.tag} has successfully connected.`)

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