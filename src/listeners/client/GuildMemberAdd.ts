import { Listener } from 'discord-akairo'
import { GuildMember, MessageEmbed, TextChannel } from 'discord.js'
import moment from 'moment'

import { Colours } from '../../util/Colours'
import { createWelcomeMessage } from '../../util/Functions'

export default class GuildMemberAdd extends Listener {
    public constructor() {
        super('guildmemberadd', {
            event: 'guildMemberAdd',
            type: 'client',
            emitter: 'client'
        })
    }

    public async exec(member: GuildMember) {
        const guild = member.guild

        //JoinMessage
        const joinMessageChannel = guild.channels.resolve(this.client.settings.get(guild, 'join-leave.channel', '')) as TextChannel
        const joinMessage: string = this.client.settings.get(guild, 'join-leave.joinMessage', '')

        if (joinMessageChannel && joinMessage) await joinMessageChannel.send(createWelcomeMessage(member, joinMessage))

        //User-logs
        const userJoinLogs = this.client.settings.get(guild, 'logs.user-logs.join', false)

        if (userJoinLogs) {
            const userJoinLogsChannel = guild.channels.resolve(this.client.settings.get(guild, 'logs.user-logs.channel', '')) as TextChannel

            const e = new MessageEmbed()
                .setAuthor(`User Joined | ${member.user.tag}`, member.user.displayAvatarURL({ dynamic: true }))
                .setDescription(`New member has joined the server!`)
                .setColor(Colours.SteelBlue)
                .addField('User:', `${member.user.tag} (${member.user.id})`)
                .addField('Joined at:', `${moment(member.joinedAt).utcOffset(1).format('YYYY/MM/DD HH:mm:ss')}`)

            if (userJoinLogsChannel) userJoinLogsChannel.send(e)
        }
        
        //AutoRole
        const autoRoles: { humans: string[], bots: string[], all: string[] } = this.client.settings.get(guild, 'autoRoles', {})
        if (autoRoles) {
            if (autoRoles.humans && autoRoles.humans.length > 0 && !member.user.bot) await member.roles.add(autoRoles.humans)
            if (autoRoles.bots && autoRoles.bots.length > 0 && member.user.bot) await member.roles.add(autoRoles.bots)
            if (autoRoles.all && autoRoles.all.length > 0) await member.roles.add(autoRoles.all)
        }
    }
}