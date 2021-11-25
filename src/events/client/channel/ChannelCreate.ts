import { Listener } from 'discord-akairo'
import { DMChannel, GuildChannel, MessageEmbed, TextChannel } from 'discord.js'

import { Colours } from '../../../util/Colours'

export default class ChannelCreate extends Listener {
    public constructor() {
        super('channelcreate', {
            emitter: 'client',
            event: 'channelCreate',
            category: 'client'
        })
    }

    public exec(channel: DMChannel | GuildChannel) {
        if (channel.type !== 'DM') {
            const guild = channel.guild
            const channelLogs = guild.channels.resolve(this.client.settings.get(guild, 'logs.channel-logs', '')) as TextChannel

            if (channelLogs) {
                const e = new MessageEmbed()
                    .setAuthor(`New Channel Created | ${guild.name}`)
                    .setDescription(`**New channel:**\n${channel.name} (${channel.id}): ${channel.type}`)
                    .setColor(Colours.Green)
                    
                    if ((channel.type === 'GUILD_TEXT' || channel.type === 'GUILD_NEWS' || channel.type === 'GUILD_VOICE') && channel.permissionOverwrites.cache.size) 
                        e.addField('Channel Permissions:', `${channel.permissionOverwrites ?
                            channel.permissionOverwrites.cache.map(p => p.allow.toArray().join('\n')) : 'This channel has no permission overwrites'}`)

                channelLogs.send({ embeds: [e] })
            }
        }
    }
}