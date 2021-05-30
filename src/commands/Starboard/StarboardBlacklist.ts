import { Argument, Command } from 'discord-akairo'
import { GuildMember, Message, TextChannel } from 'discord.js'

export default class StarboardBlacklist extends Command {
    public constructor() {
        super('starboardblacklist', {
            aliases: ['starboardblacklist', 'sbblacklist'],
            category: 'Starboard',
            description: {
                content: 'Blacklists a channel/user from having any interaction with the starboard.',
                usage: 'starboardblacklist <\'channel\'/\'user\'> [channel/user]',
                examples: ['starboardblacklist channel #starboard', 'starboardblacklist user @user1'],
            },
            ownerOnly: true,
            channel: 'guild',
            ratelimit: 3,
        })
    }

    *args() {
        const type = yield {
            index: 0,
            type: (_: Message, phrase: string) => {
                if (phrase.toLowerCase() === 'user' || phrase.toLowerCase() === 'channel') return phrase
                return null
            },
            default: null
        }

        const target = yield {
            index: 1,
            type: Argument.union('textChannel', 'member'),
            default: null
        }

        if (!(type === 'user' && target instanceof GuildMember) && !(type === 'channel' && target instanceof TextChannel)) return null
        return { type, target }
    }

    //@ts-ignore
    userPermissions(message: Message) {
        const modRole: string = this.client.settings.get(message.guild, 'modRole', '')
        const hasStaffRole = message.member.hasPermission('MANAGE_GUILD', { checkAdmin: true, checkOwner: true}) || message.member.roles.cache.has(modRole)

        if (!hasStaffRole) return 'Moderator'
        return null
    }

    public exec(message: Message, {type, target}): Promise<Message> {
        if (type === null || target === null) return message.util!.send('Okay so neither of your inputs matched and something is missing.')
        
        if (type === 'user' && target instanceof GuildMember) {
            const sbBlacklist: string[] = this.client.settings.get(message.guild, 'starboard.user-blacklist', [])

            if (sbBlacklist.includes(target.user.id)) return message.util!.send('This user is already blacklisted!')
    
            sbBlacklist.push(target.user.id)
    
            this.client.settings.set(message.guild, 'starboard.user-blacklist', sbBlacklist)
            return message.util!.send(`${target} has successfully been blacklisted from the starboard.`)
        }
        else if (type === 'channel' && target instanceof TextChannel) {
            const sbBlacklist: string[] = this.client.settings.get(message.guild, 'starboard.channel-blacklist', [])

            if (sbBlacklist.includes(target.id)) return message.util!.send('This channel is already blacklisted from being noticed.')

            sbBlacklist.push(target.id)

            this.client.settings.set(message.guild, 'starboard.channel-blacklist', sbBlacklist)
            return message.util!.send(`${target} has now been blacklisted from stars being detected.`)
        }
    }
}
