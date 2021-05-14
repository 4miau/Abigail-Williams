import { Command } from 'discord-akairo'
import { GuildMemberResolvable, Message } from 'discord.js'

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

    public async exec(message: Message, {member}: {member: GuildMemberResolvable}): Promise<Message> {
        if (!member) return message.util!.send('You must provide a member to blacklist.')
        console.log(member)

        const userBlacklist: string[] = this.client.settings.get(message.guild, 'user-blacklist', [])
        const userResolved = message.guild.members.resolve(member)

        if (userBlacklist.includes(userResolved.user.id)) {
            return message.util!.send('This user is already blacklisted')
        }

        userBlacklist.push(userResolved.user.id)
        this.client.settings.set(message.guild, 'user-blacklist', userBlacklist)
        return message.util!.send('User has been blacklisted.')


    }
}