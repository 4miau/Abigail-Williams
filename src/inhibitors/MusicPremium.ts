import { Command, Inhibitor } from 'discord-akairo'
import { Message } from 'discord.js'

export default class MusicPremium extends Inhibitor {
    public constructor() {
        super('musicpremium', {
            'reason': 'musicPremium',
            type: 'post'
        })
    }

    exec(message: Message, command: Command): boolean {
        if (!command || !message.guild) return false

        const hasPremium = this.client.settings.get(message.guild, 'has-premium', false)

        if (command.categoryID === 'Music' && !hasPremium) return true
        else return false
    }
}