import { TextChannel, MessageAttachment } from 'discord.js'

import Service from '../../modules/Service'
import { globalThreadLogs } from '../../util/Constants'

export default class PublishThreadLog extends Service {
    public constructor() {
        super('publishthreadlog', {
            category: 'Threads'
        })
    }

    async exec(buffer: Buffer, name: string): Promise<string> {
        const publishLog = this.client.channels.resolve(globalThreadLogs) as TextChannel 
        const attachment = new MessageAttachment(buffer, `${name}.txt`)
        const logMessage = await publishLog.send({ files: [attachment] })

        return logMessage.attachments.first().url
    }
}