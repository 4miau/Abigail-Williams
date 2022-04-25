import { Listener } from 'discord-akairo'
import { DMChannel, GuildChannel, MessageEmbed, TextChannel } from 'discord.js'

import { Colours } from '../../../util/Colours'

export default class ChannelUpdate extends Listener {
    public constructor() {
        super('channelupdate', {
            emitter: 'client',
            event: 'channelUpdate',
            category: 'client'
        })
    }

    public async exec(oldChannel: DMChannel | GuildChannel, newChannel: DMChannel | GuildChannel) {
        if (oldChannel.type === 'DM' || newChannel.type === 'DM') return
        const guild = newChannel.guild
        const channelLogs = guild.channels.resolve(this.client.settings.get(guild, 'logs.channel-logs', '')) as TextChannel

        if (!channelLogs) return

        let e = new MessageEmbed()
            .setAuthor(`Channel Updated | ${newChannel.name}`)
            .setColor(Colours.Orange)

        if (oldChannel.name !== newChannel.name) {
            e = await this.nameChangeEmbed(e, oldChannel, newChannel)
            channelLogs.send({ embeds: [e] })
        }
        if (oldChannel.permissionOverwrites.cache.size === newChannel.permissionOverwrites.cache.size) {
            e.fields.length > 0 ? e.spliceFields(0, e.fields.length) : void 0
            e = await this.permChangeEmbed(e, oldChannel, newChannel)
            channelLogs.send({ embeds: [e] })
        }
    }

    private async nameChangeEmbed(embed: MessageEmbed, oldChannel: GuildChannel, newChannel: GuildChannel) {
        embed.addField('Old channel name:', oldChannel.name)
        embed.addField('New channel name:', newChannel.name)
        return embed
    }

    private async permChangeEmbed(embed: MessageEmbed, oldChannel: GuildChannel, newChannel: GuildChannel) {
        const guild = newChannel.guild
        const oldPerms = oldChannel.permissionOverwrites.cache.map(({ id, type, allow, deny }) => { return { id, type, allow, deny }})
        const newPerms = newChannel.permissionOverwrites.cache.map(({ id, type, allow, deny }) => { return { id, type, allow, deny }})

        const uniqueIDs = newPerms
            .map(({ id, allow, deny }) => {
                const op = oldPerms.find(p => p.id === id)
                if (allow.bitfield !== op.allow.bitfield && deny.bitfield !== op.deny.bitfield) return id
            })
            .filter(uid => uid)

        if (!uniqueIDs) return

        for (let i = 0; i < newPerms.length; i++) {
            if (!uniqueIDs.includes(newPerms[i].id)) continue

            if (newPerms[i].type === 'role') {
                embed.addField(
                    `${guild.roles.resolve(oldPerms[i].id).name || 'everyone'} old permissions:`,
                    `ALLOW: ${oldPerms[i].allow.toArray().join(', ') || 'Default permissions' }\nDENY: ${oldPerms[i].deny.toArray().join(', ') || 'Default permissions'}`
                )
                embed.addField(
                    `${guild.roles.resolve(newPerms[i].id).name || 'everyone'} new permissions:`,
                    `ALLOW: ${newPerms[i].allow.toArray().join(', ') || 'Default permissions'}\nDENY: ${newPerms[i].deny.toArray().join(', ') || 'Default permissions'}`
                )
            }
            else {
                embed.addField(
                    `${guild.members.resolve(oldPerms[i].id) || 'everyone'} old permissions:`,
                    `ALLOW ${oldPerms[i].allow.toArray().join(', ') || 'Default permissions'}\nDENY: ${oldPerms[i].deny.toArray().join(', ') || 'Default permissions'}`
                )
                embed.addField(
                    `${guild.members.resolve(newPerms[i].id) || 'everyone'} new permissions:`,
                    `ALLOW ${newPerms[i].allow.toArray().join(', ') || 'Default permissions'}\nDENY: ${newPerms[i].deny.toArray().join(', ') || 'Default permissions'}`
                )
            }
        }

        return embed
    }
}