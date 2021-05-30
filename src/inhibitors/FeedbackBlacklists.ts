import { Inhibitor, Command } from "discord-akairo"
import { Message } from 'discord.js'

export default class FeedbackBlacklists extends Inhibitor {
    public constructor() {
        super('feedbackblacklists', {
            reason: 'feedbackBlacklist',
            type: 'post'
        })
    }

    async exec(message: Message, command: Command): Promise<boolean> {
        if (command.id !== 'feedbackblacklist') return false
        
        const fbBlacklists: string[] = this.client.settings.get('global', 'feedback-blacklist', [])

        if (!fbBlacklists) return false

        return (fbBlacklists.includes(message.author.id) && !this.client.isOwner(message.author.id)) ? true : false
    }
}

/*
import { Inhibitor, Command } from "discord-akairo";
import { Message } from "discord.js";

export default class ChannelBlacklist extends Inhibitor {
    public constructor() {
        super('channelblacklist', {
            'reason': 'channelBlacklist',
            'type': 'post',
        })
    }

    async exec(message: Message): Promise<boolean> {
        const blacklistedChannels: string[] = this.client.settings.get(message.guild, 'channel-blacklist', [])
        if (!blacklistedChannels) return false

        return (blacklistedChannels.includes(message.channel.id) && message.author.id !== this.client.ownerID.toString()) ? true : false
    }
}
*/