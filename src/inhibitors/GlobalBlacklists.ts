import { Inhibitor, Command } from "discord-akairo";
import { Message } from "discord.js";

export default class GlobalBlacklist extends Inhibitor {
    public constructor() {
        super('globalblacklist', {
            'reason': 'globalBlacklist',
            'type': 'post',
        })
    }

    async exec(message: Message): Promise<boolean> {
        const globalBlacklist: string[] = this.client.settings.get('global', 'user-blacklist', [])
        if (!globalBlacklist) return false

        return (globalBlacklist.includes(message.author.id) && message.author.id !== this.client.ownerID) ? true : false
    }
}