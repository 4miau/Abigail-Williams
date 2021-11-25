import { Command, Argument } from 'discord-akairo'
import { GuildMember, Message, TextChannel } from 'discord.js'

export default class StarboardWhitelist extends Command {
    public constructor() {
        super('starboardwhitelist', {
            aliases: ['starboardwhitelist', 'sbwhitelist'],
            category: 'Starboard',
            description: {
                content: 'Whitelists a blacklisted channel/user from the starboard.',
                usage: 'starboardwhitelist <\'channel\'/\'user\'> [channel/user]',
                examples: ['starboardwhitelist @user', 'sbwhitelist 1234567890'],
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
        const hasStaffRole = message.member.permissions.has('MANAGE_GUILD', true) || message.member.roles.cache.has(modRole)

        if (!hasStaffRole) return 'Moderator'
        return null
    }

    public exec(message: Message, {type, target}): Promise<Message> {
        if (type === null || target === null) return message.channel.send('Okay so neither of your inputs matched and something is missing.')

        if (type === 'user' && target instanceof GuildMember) {
            const sbBlacklist: string[] = this.client.settings.get(message.guild, 'starboard.user-blacklist', [])

            if (!sbBlacklist.includes(target.user.id)) return message.channel.send('This user is not blacklisted!')

            this.client.settings.set(message.guild, 'starboard.user-blacklist', sbBlacklist.filter(ub => ub !== target.user.id))
            return message.channel.send(`${target} has now been whitelisted from the starboard.`)
        }
        else if (type === 'channel' && target instanceof TextChannel) {
            const sbBlacklist: string[] = this.client.settings.get(message.guild, 'starboard.channel-blacklist', [])

            if (!sbBlacklist.includes(target.id)) return message.channel.send('This channel is not blacklisted.')

            this.client.settings.set(message.guild, 'starboard.channel-blacklist', sbBlacklist.filter(cb => cb !== target.id))
            return message.channel.send(`${target} has now been whitelisted and can be detected again.`)
        }

    }
}