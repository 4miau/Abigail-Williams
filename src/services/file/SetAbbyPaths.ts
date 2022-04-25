import { TextChannel } from 'discord.js'

import Service from '../../modules/Service'

export default class SetAbbyPaths extends Service {
    public constructor() {
        super('setabbypaths', {
            category: 'File'
        })
    }

    exec(): void {
        const fileDirsService = this.client.serviceHandler.modules.get('createfiledirs')

        this.client.abbyHomeServer = this.client.guilds.resolve('542751800739233798')
        this.client.abbyLog = this.client.channels.resolve('842906441458384926') as TextChannel
        this.client.abbyReport = this.client.channels.resolve('849744056866963467') as TextChannel
        this.client.queue.add(fileDirsService.exec())
    }
}