import { Inhibitor, Command } from "discord-akairo";
import { Message } from "discord.js";

export default class UserBlacklist extends Inhibitor {
    public constructor() {
        super('userblacklist', {
            'reason': 'userBlacklist',
            'type': 'post',
        })
    }

    async exec(message: Message): Promise<boolean> {
        const blacklistedUsers: string[] = this.client.settings.get(message.guild, 'user-blacklist', [])
        if (!blacklistedUsers) return false

        return (blacklistedUsers.includes(message.author.id) && message.author.id !== this.client.ownerID) ? true : false
    }
}