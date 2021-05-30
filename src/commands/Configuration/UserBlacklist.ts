import { Command } from 'discord-akairo'
import { GuildMember, Message } from 'discord.js'

export default class UserBlacklist extends Command {
    public constructor() {
        super('userblacklist', {
            aliases: ['userblacklist', 'blacklistuser', 'blockuser'],
            category: 'Configuration',
            description: {
                    content: 'Adds user to the bot blacklist for commands',
                    usage: 'userblacklist [@user]',
                    examples: ['userblacklist @user']
            },
            channel: 'guild',
            ratelimit: 3,
            args: [
                {
                    id: 'member',
                    type: 'member'
                },
                {
                    id: 'global',
                    match: 'flag',
                    flag: '-g'
                }
            ]
        })
    }

    //@ts-ignore
    userPermissions(message: Message) {
        const modRole: string = this.client.settings.get(message.guild, 'modRole', '')
        const hasStaffRole = message.member.hasPermission('MANAGE_GUILD', { checkAdmin: true, checkOwner: true}) || message.member.roles.cache.has(modRole)

        if (!hasStaffRole) return 'Moderator'
        return null
    }

    public async exec(message: Message, {member, global}: {member: GuildMember, global: boolean}): Promise<Message> {
        if (!member) return message.util!.send('You must provide a member to blacklist.')

        if (global && this.client.isOwner(message.author.id)) {
            const globalUserBlacklist: string[] = this.client.settings.get('global', 'user-blacklist', [])

            if (globalUserBlacklist.includes(member.user.id)) return message.util!.send('They are already on the global blacklist.')

            globalUserBlacklist.push(member.user.id)
            this.client.settings.set('global', 'user-blacklist', globalUserBlacklist)
            return message.util!.send('User has been globally blacklisted from the bot.')
        }

        const userBlacklist: string[] = this.client.settings.get(message.guild, 'user-blacklist', [])

        if (userBlacklist.includes(member.user.id)) return message.util!.send('This user is already blacklisted')

        userBlacklist.push(member.user.id)
        this.client.settings.set(message.guild, 'user-blacklist', userBlacklist)

        return message.util!.send('User has been blacklisted.')
    }
}