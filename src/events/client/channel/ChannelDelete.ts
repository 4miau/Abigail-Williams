import { Listener } from 'discord-akairo'
import { DMChannel, GuildChannel, MessageEmbed, TextChannel } from 'discord.js'

import { Colours } from '../../../util/Colours'

export default class ChannelDelete extends Listener {
    public constructor() {
        super('channeldelete', {
            emitter: 'client',
            event: 'channelDelete',
            category: 'client'
        })
    }

    public exec(channel: DMChannel | GuildChannel) {
        if (channel.type !== 'DM') {
            const guild = channel.guild
            const channelLogs = guild.channels.resolve(this.client.settings.get(guild, 'logs.channel-logs', '')) as TextChannel

            if (channelLogs) {
                const e = new MessageEmbed()
                    .setAuthor(`Channel Deleted | ${guild.name}`)
                    .setDescription(`**Channel deleted:**\n${channel.name} (${channel.id}): ${channel.type}`)
                    .setColor(Colours.Crimson)

                channelLogs.send({ embeds: [e] })
            }
        }
    }
}