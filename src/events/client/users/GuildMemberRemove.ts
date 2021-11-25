import { Listener } from 'discord-akairo'
import { GuildMember, MessageEmbed, TextChannel } from 'discord.js'
import moment from 'moment'

import { Colours } from '../../../util/Colours'
import { createWelcomeMessage } from '../../../util/functions/guild'

export default class GuildMemberRemove extends Listener {
    public constructor() {
        super('guildmemberremove', {
            emitter: 'client',
            event: 'guildMemberRemove',
            category: 'client',
        })
    }

    public async exec(member: GuildMember) {
        const guild = member.guild

        //LeaveMessage
        const joinMessageChannel = guild.channels.resolve(this.client.settings.get(guild, 'join-leave.channel', '')) as TextChannel
        const leaveMessage: string = this.client.settings.get(guild, 'join-leave.leaveMessage', '')

        if (joinMessageChannel && leaveMessage) joinMessageChannel.send(createWelcomeMessage(member, leaveMessage))

        //Guild Leave Logs
        const guildLogs = guild.channels.resolve(this.client.settings.get(guild, 'logs-guild-logs', '')) as TextChannel

        if (guildLogs) {
            const e = new MessageEmbed()
                .setAuthor(`User Left | ${member.user.tag}`)
                .setColor(Colours.Red)
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true, format: 'png' }))
                .setDescription(`${member.user.tag} (${member.user.id})`)
                .setFooter(`Left at ${moment(Date.now()).utcOffset(1).format('YYYY/MM/DD HH:mm:ss')}`)
                
            guildLogs.send({ embeds: [e] }) 
        }
    }
}