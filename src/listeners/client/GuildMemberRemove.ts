import { Listener } from "discord-akairo"
import { GuildMember, MessageEmbed, TextChannel } from 'discord.js'
import moment from "moment"

import { Colours } from "../../util/Colours"
import { createWelcomeMessage } from '../../util/Functions'

export default class GuildMemberRemove extends Listener {
    public constructor() {
        super('guildmemberremove', {
            event: 'guildMemberRemove',
            type: 'client',
            emitter: 'client'
        })
    }

    public async exec(member: GuildMember) {
        const guild = member.guild

        //LeaveMessage
        const joinMessageChannel = guild.channels.resolve(this.client.settings.get(guild, 'join-leave.channel', '')) as TextChannel
        const leaveMessage: string = this.client.settings.get(guild, 'join-leave.leaveMessage', '')

        if (joinMessageChannel && leaveMessage) joinMessageChannel.send(createWelcomeMessage(member, leaveMessage))

        //User-logs
        const userLeaveLogs = this.client.settings.get(guild, 'logs.user-logs.leave', false)

        if (userLeaveLogs) {
            const userLeaveLogsChannel = guild.channels.resolve(this.client.settings.get(guild, 'logs.user-logs.channel', '')) as TextChannel

            const e = new MessageEmbed()
                .setAuthor(`User left | ${member.user.tag}`, member.user.displayAvatarURL({ dynamic: true}))
                .setDescription(`A member has left the server!`)
                .setColor(Colours.IndianRed)
                .addField('User:', `${member.user.tag} (${member.user.id})`)
                .addField('Left at:', `${moment(Date.now()).utcOffset(1).format('YYYY/MM/DD HH:mm:ss')}`)

            if (userLeaveLogsChannel) userLeaveLogsChannel.send(e)
        }
    }
}