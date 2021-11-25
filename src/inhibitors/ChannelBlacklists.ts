import { Inhibitor } from 'discord-akairo'
import { Message } from 'discord.js'

export default class ChannelBlacklist extends Inhibitor {
    public constructor() {
        super('channelblacklist', {
            'reason': 'channelBlacklist',
            'type': 'post',
        })
    }

    exec(message: Message): boolean {
        const blacklistedChannels: string[] = this.client.settings.get(message.guild, 'channel-blacklist', [])
        if (!blacklistedChannels) return false

        return (blacklistedChannels.includes(message.channel.id) && message.author.id !== this.client.ownerID.toString()) ? true : false
    }
}