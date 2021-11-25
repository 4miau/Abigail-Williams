import { Command } from 'discord-akairo'
import { Message, MessageEmbed } from 'discord.js'
import { Colours } from '../../util/Colours'

export default class StarConfig extends Command {
    public constructor() {
        super('starconfig', {
            aliases: ['starconfig'],
            category: 'Starboard',
            description: {
                content: 'Gets the current settings for the server\'s starboard',
                usage: 'starconfig',
                examples: ['starconfig'],
            },
            channel: 'guild',
            ratelimit: 3
        })
    }

    //@ts-ignore
    userPermissions(message: Message) {
        const modRole = this.client.settings.get(message.guild, 'modRole', '')
        const hasStaffRole = message.member.permissions.has('MANAGE_GUILD', true) || message.member.roles.cache.has(modRole)

        if (!hasStaffRole) return 'Moderator'
        return null
    }

    public exec(message: Message): Promise<Message> {
        const e = new MessageEmbed()
            .setTitle('Settings')
            .setColor(Colours.Golden)
            .setDescription([
                `**Emoji**: ${this.client.settings.get(message.guild, 'starboard.emoji', '⭐')}`,
                `**Starboard**: ${this.client.settings.get(message.guild, 'starboard.starboardChannelID', 'None')}`,
                `**Threshold**: ${this.client.settings.get(message.guild, 'starboard.threshold', 'None')}`,
                `**Blacklist**: ${this.client.settings.get(message.guild, 'starboard.user-blacklist', [])?.join(', ') || 'No blacklisted users'}`,
                `**Blacklisted Channels**: ${this.client.settings.get(message.guild, 'starboard.channel-blacklist', []).join(', ') || 'No blacklisted channels'}`
            ].join('\n\n'))

        return message.channel.send({ embeds: [e] })
    }
}