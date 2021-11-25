import { Listener } from 'discord-akairo'
import { GuildMember, MessageEmbed, TextChannel } from 'discord.js'
import moment from 'moment'

import Profile from '../../../models/Profile'
import { Colours } from '../../../util/Colours'
import { createWelcomeMessage } from '../../../util/functions/guild'

export default class GuildMemberAdd extends Listener {
    public constructor() {
        super('guildmemberadd', {
            emitter: 'client',
            event: 'guildMemberAdd',
            category: 'client',
        })
    }

    public async exec(member: GuildMember) {
        const guild = member.guild

        //JoinMessage
        const joinMessageChannel = guild.channels.resolve(this.client.settings.get(guild, 'join-leave.channel', '')) as TextChannel
        const joinMessage: string = this.client.settings.get(guild, 'join-leave.joinMessage', '')

        if (joinMessageChannel && joinMessage) await joinMessageChannel.send(createWelcomeMessage(member, joinMessage))

        //Guild Join Logs
        const guildLogs = guild.channels.resolve(this.client.settings.get(guild, 'logs.guild-logs', ''))  as TextChannel

        if (guildLogs) {
            const e = new MessageEmbed()
                .setAuthor(`User Joined | ${member.user.tag}`)
                .setColor(Colours.Green)
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true, format: 'png' }))
                .setDescription(`${member.user.tag} (${member.user.id})`)
                .setFooter(`Joined at ${moment(member.joinedAt).utcOffset(1).format('YYYY/MM/DD HH:mm:ss')}`)

            guildLogs.send({ embeds: [e] }) 
        }

        //Create Profile
        const hasProfile = await Profile.findOne({ userID: member.user.id }) ? true : false
        const guildIndex = await Profile.findOne({ userID: member.user.id })?.then(p => p?.guildstats.findIndex(i => i.guild === member.guild.id) || 0)

        if (!hasProfile) this.client.profileManager.createProfile(member.user.id, guild.id)
        else if (hasProfile && !guildIndex) this.client.profileManager.updateProfile(member.user.id, guild.id)
        
        //AutoRole
        const autoRoles: { human: string[], bots: string[], all: string[] }  = this.client.settings.get(member.guild, 'autoRoles', {})
        if (!autoRoles.isObjectEmpty()) {
            if (autoRoles.human && autoRoles.human.length > 0 && !member.user.bot) await member.roles.add(autoRoles.human)
            if (autoRoles.bots && autoRoles.bots.length > 0 && member.user.bot) await member.roles.add(autoRoles.bots)
            if (autoRoles.all && autoRoles.all.length > 0) await member.roles.add(autoRoles.all)
        }
    }
}