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
            ratelimit: 3,
            args: [
                {
                    id: 'member',
                    type: 'member',
                },
                {
                    id: 'global',
                    match: 'flag',
                    flag: '-global'
                }
            ]
        })
    }

    //@ts-ignore
    userPermissions(message: Message) {
        const modRole = this.client.settings.get(message.guild, 'modRole', '')
        const hasStaffRole = message.member.permissions.has('MANAGE_GUILD', true) || message.member.roles.cache.has(modRole)

        if (!hasStaffRole) return 'Moderator'
        return null
    }

    public exec(message: Message, {member, global}: {member: GuildMember, global: boolean}): Promise<Message> {
        if (!member) return message.channel.send('You must provide a valid user to whitelist.')

        if (global && this.client.isOwner(message.author.id)) {
            const globalUserBlacklist: string[] = this.client.settings.get('global', 'user-blacklist', [])

            if (!globalUserBlacklist.includes(member.user.id)) return message.channel.send('This user is not globally blacklisted.')

            this.client.settings.set('global', 'user-blacklist', globalUserBlacklist.filter(gbc => gbc !== member.user.id))
            return message.channel.send('User is no longer globally blacklisted.')
        }

        const userBlacklist: string[] = this.client.settings.get(message.guild, 'user-blacklist', [])

        if (!userBlacklist.includes(member.user.id)) return message.channel.send('This user is not blacklisted.')

        this.client.settings.set(message.guild, 'user-blacklist', userBlacklist.filter(bc => bc !== member.user.id))
        return message.channel.send('User has now been whitelisted')
    }
}