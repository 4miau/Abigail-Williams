import { Command } from 'discord-akairo'
import { GuildChannel, Message } from 'discord.js'

export default class Ignore extends Command {
    public constructor() {
        super('ignore', {
            aliases: ['ignore', 'ignore-channel'],
            category: 'Configuration',
            description: {
                content: 'Adds or removes a channel from my ignore list, I will not read messages from there.',
                usage: 'ignore [\'add\'/\'remove\'] [channel]',
                examples: ['ignore add #spam'],
            },
            channel: 'guild',
            ratelimit: 3,
        })
    }

    *args(): unknown {
        const type = yield {
            index: 0,
            type: (_: Message, str: string) => {
                if (str === 'add' || str === 'remove') return str
                return null
            },
            match: 'phrase',
            default: null
        }

        const channel = yield {
            index: 1,
            type: 'channel',
            match: 'rest',
            default: null
        }

        return { type, channel }
    }

    //@ts-ignore
    userPermissions(message: Message) {
        const modRole = this.client.settings.get(message.guild, 'modRole', '')
        const hasStaffRole = message.member.permissions.has('MANAGE_GUILD', true) || message.member.roles.cache.has(modRole)

        if (!hasStaffRole) return 'Moderator'
        return null
    }

    public exec(message: Message, {type, channel}: {type: string, channel: GuildChannel}): Promise<Message> {
        if (!type || !channel) return message.channel.send('Please provide a valid type and a channel.')
        if (channel.type === 'GUILD_VOICE'  || channel.type === 'GUILD_CATEGORY' || channel.type === 'GUILD_STORE') return message.channel.send('Must be a text-based channel.')
        
        const ignoredChannels: string[] = this.client.settings.get(message.guild, 'ignored-channels', [])

        if (type.caseCompare('add')) {
            ignoredChannels.push(channel.toString())
            this.client.settings.set(message.guild, 'ignored-channels', ignoredChannels)
            return message.channel.send('I have added this channel onto my ignore list.')
        }
        else {
            if (ignoredChannels.arrayEmpty()) return message.channel.send('The ignored list is empty, so there is nothing to remove.')
            this.client.settings.set(message.guild, 'ignored-channels', ignoredChannels.filter(c => c !== channel.toString()))
            return message.channel.send('I have removed this channel from my ignore list.')
        }
    }
}