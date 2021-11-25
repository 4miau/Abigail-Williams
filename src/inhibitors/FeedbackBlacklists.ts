import { Inhibitor, Command } from 'discord-akairo'
import { Message } from 'discord.js'

export default class FeedbackBlacklists extends Inhibitor {
    public constructor() {
        super('feedbackblacklists', {
            reason: 'feedbackBlacklist',
            type: 'post'
        })
    }

    exec(message: Message, command: Command): boolean {
        if (command.id !== 'feedbackblacklist') return false
        
        const fbBlacklists: string[] = this.client.settings.get('global', 'feedback-blacklist', [])
        if (!fbBlacklists) return false

        return (fbBlacklists.includes(message.author.id) && !this.client.isOwner(message.author.id)) ? true : false
    }
}