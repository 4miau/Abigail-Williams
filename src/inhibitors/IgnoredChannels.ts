import { Inhibitor } from 'discord-akairo'
import { Message } from 'discord.js'

export default class IgnoredChannels extends Inhibitor {
    public constructor() {
        super('ignoredchannels', {
            reason: 'ignoredChannel',
            type: 'pre'
        })
    }

    exec(message: Message): boolean {
        const ignoredChannels: string[] = this.client.settings.get(message.guild, 'ignored-channels', [])
        if (!ignoredChannels) return false

        if (ignoredChannels.includes(message.channel.id)) return true

        return false
    }
}