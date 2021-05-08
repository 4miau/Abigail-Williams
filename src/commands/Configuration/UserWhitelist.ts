import { Command } from 'discord-akairo'
import { GuildMember, Message } from 'discord.js'

export default class UserWhitelist extends Command {
    public constructor() {
        super('userwhitelist', {
            aliases: ['userwhitelist', 'uwhitelist', 'whitelistuser', 'adduser'],
            category: 'Configuration',
            description: {
                    content: 'Adds user to the bot whitelist for commands',
                    usage: 'userwhitelist [@user]',
                    examples: ['userwhitelist @user']
            },
            channel: 'guild',
            userPermissions: ['MANAGE_GUILD'],
            ratelimit: 3,
            args: [
                {
                    id: 'member',
                    type: 'member',
                }
            ]
        })
    }

    public exec(message: Message, {member}: {member: GuildMember}): Promise<Message> {
        if (!member) return message.util!.send('You must provide a valid user to whitelist.')

        let userWhitelist: string[] = this.client.settings.get(message.guild, 'user-blacklist', [])
        
        if (userWhitelist.includes(member.user.id)) {
            userWhitelist = userWhitelist.filter(bc => bc !== member.user.id)
            this.client.settings.set(message.guild, 'user-blacklist', userWhitelist)
            return message.util!.send('User has now been whitelisted')
        }

        return message.util!.send('User is not blacklisted.')
    }
}