import { Command, Inhibitor } from 'discord-akairo'
import { Message } from 'discord.js'

export default class TwitchPremium extends Inhibitor {
    public constructor() {
        super('twitchpremium', {
            'reason': 'twitchPremium',
            type: 'post'
        })
    }

    exec(message: Message, command: Command): boolean {
        if (!command || !message.guild) return false

        const hasPremium = this.client.settings.get(message.guild, 'has-premium', false)

        if (command.categoryID === 'Twitch' && !hasPremium) return true
        else return false
    }
}