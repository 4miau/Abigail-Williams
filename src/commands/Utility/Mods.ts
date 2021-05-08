import { Command } from 'discord-akairo'
import { Role } from 'discord.js'
import { Message } from 'discord.js'

export default class Mods extends Command {
    public constructor() {
        super('mods', {
            aliases: ['moderators', 'mods', 'capos'],
            category: 'Utility',
            description: {
                    content: 'Displays the mods in the server.',
                    usage: 'mods',
                    examples: ['mods']
            },
            ratelimit: 3
        })
    }

    public async exec(message: Message): Promise<Message> {
        const supportRole = this.client.settings.get(message.guild, 'modmail.support-role', '') ? 
            message.guild.roles.resolve(this.client.settings.get(message.guild, 'modmail.support-role', '')) : void 0

        return message.util!.send('ok')
    }
}