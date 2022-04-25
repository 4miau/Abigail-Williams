import { TextChannel } from 'discord.js'

import Service from '../../modules/Service'
import BotStatus from '../../models/BotStatus'
import { OwnerDMChannel } from '../../util/Constants'

export default class SetBotStatus extends Service {
    public constructor() {
        super('setbotstatus', {
            category: 'GuildAsync'
        })
    }

    async exec(): Promise<void> {
        const currBotStatus = await BotStatus.findOne({ id: 1 })

        if (currBotStatus && currBotStatus.presenceType) {
            const startUpChannel = this.client.channels.cache.get(OwnerDMChannel) as TextChannel //My DM channel with the bot
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
}