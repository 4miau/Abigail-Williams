import { Inhibitor, Command } from "discord-akairo";
import { Message } from "discord.js";

export default class Blacklist extends Inhibitor {
    public constructor() {
        super('blacklist', {
            'reason': 'blacklist',
            'type': 'post',
        })
    }

    async exec(message: Message, command: Command): Promise<boolean> {
        //blacklistedChannels
        const blacklistedChannels: string[] = this.client.settings.get(message.guild, 'channel-blacklist', [])
        if (blacklistedChannels) {
            if (blacklistedChannels.includes(message.channel.id) && message.author.id !== this.client.ownerID) return true
        }

        //blacklistedUsers
        const blacklistedUsers: string[] = this.client.settings.get(message.guild, 'user-blacklist', [])
        if (blacklistedUsers) {
            if (blacklistedUsers.includes(message.author.id) && message.author.id !== this.client.ownerID) return true
        }

        //blacklistedGlobally
        const globalBlacklist: string[] = this.client.settings.get('global', 'user-blacklist', [])
        if (globalBlacklist) {
            if (globalBlacklist.includes(message.author.id) && message.author.id !== this.client.ownerID) return true
        }

        //blacklistedFromModmail

        //StartThread inside server 
        if (command.aliases.includes('startthread') || command.aliases.includes('')) console.log('hi')
    }
}