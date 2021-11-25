import { Listener } from 'discord-akairo'
import { GuildMember, MessageEmbed, TextChannel } from 'discord.js'
import moment from 'moment'
import ms from 'ms'

import Case from '../../../models/Case'
import { Colours } from '../../../util/Colours'
import ModUtil from '../../../util/structures/ModUtil'

export default class GuildMemberUpdate extends Listener {
    public constructor() {
        super('guildmemberupdate', {
            emitter: 'client',
            event: 'guildMemberUpdate',
            category: 'client'
        })
    }

    public async exec(oldUser: GuildMember, newUser: GuildMember) {
        const guild = newUser.guild

        //User-logs (username + nickname)
        const userLogsChannel = guild.channels.resolve(this.client.settings.get(guild, 'logs.user-logs', '')) as TextChannel

        if (userLogsChannel) {
            const e = new MessageEmbed()
                .setAuthor(`User Update | ${newUser.user.tag}`)
                e.setDescription(`**Server:** ${guild.name} (${guild.id})`)
                .setColor(Colours.Coral)
                .setThumbnail(newUser.user.displayAvatarURL({ dynamic: true, format: 'png' }))

            if (oldUser.user.tag !== newUser.user.tag) {
                e.addField('Old username & tag:', `${oldUser.user.username} (${oldUser.user.tag})`)
                e.addField('New username & tag:', `${newUser.user.username} (${newUser.user.tag})`)

                userLogsChannel.send({ embeds: [e] })
            }
            if (oldUser.nickname !== newUser.nickname) {
                e.fields.length > 0 ? e.spliceFields(0, e.fields.length) : void 0

                e.addField('Old nickname:', `${oldUser.nickname ? oldUser.nickname : 'No nickname'} (${oldUser.user.tag})`)
                e.addField('New nickname:', `${newUser.nickname ? newUser.nickname : 'No nickname'} (${newUser.user.tag})`)

                userLogsChannel.send({ embeds: [e] })
            }
        }

        /* Modlogs */
        const modChannel = guild.channels.resolve(this.client.settings.get(guild, 'logs.mod-logs', '')) as TextChannel
        const muteRole = this.client.settings.get(guild, 'muteRole', '')

        if (modChannel) {
            const totalCases = this.client.settings.get(guild, 'totalCases', 0) + 1

            if (!oldUser.roles.cache.has(muteRole) && newUser.roles.cache.has(muteRole)) {
                const muteCase = await Case.findOne({ targetID: newUser.user.id, action: ModUtil.CONSTANTS.ACTIONS.MUTE, caseID: totalCases - 1 }).catch(void 0)
                
                if (muteCase && new Date(muteCase.createdAt) >= new Date().getTimeFromNow(Number(ms('60.15m')))) {
                    const e = new MessageEmbed()
                        .setAuthor(`User Muted | ${newUser.user.tag}`, newUser.user.displayAvatarURL({ dynamic: true, format: 'png' }))
                        .setColor(Colours.Crimson)
                        .setDescription(
                            `[\`${moment(muteCase.createdAt).format('HH:mm:ss')}\`] [\`${totalCases}\`] :mute: **${muteCase.modTag}** muted **${muteCase.targetTag}** (ID: ${newUser.user.id})\n` +
                            `\`[ Reason ]:\` ${muteCase.reason}`
                        )

                    const modMessage = await modChannel.send({ embeds: [e] }) //The mute was just created specifically by using the mute command

                    muteCase.logMessageID = modMessage.id
                    return muteCase.save()
                }
                else {
                    //Muted via adding the mute role
                    const muteEntry = await guild.fetchAuditLogs({ type: 'MEMBER_ROLE_UPDATE', limit: 10 })
                        .then(au => au.entries.find(entry => entry.target === newUser.user && new Date(entry.createdAt) > new Date().getTimeFromNow(Number(ms('10s')))))
                    const mod = muteEntry ? muteEntry.executor : newUser.user

                    const e = new MessageEmbed()
                        .setAuthor(`User Muted | ${newUser.user.tag}`, newUser.user.displayAvatarURL({ dynamic: true, format: 'png' }))
                        .setColor(Colours.Crimson)
                        .setDescription(
                            `[\`${moment(muteEntry.createdAt).format('HH:mm:ss')}\`] [\`${totalCases}\`] :mute: **${mod.tag}** muted **${newUser.user.tag}** (ID: ${newUser.user.id})\n` +
                            '`[ Reason ]:` No reason specified.'
                        )
                    
                    const modMessage = await modChannel.send({ embeds: [e] })
    
                    const newCase = new Case({
                        id: await Case.countDocuments() + 1,
                        guildID: guild.id,
                        logMessageID: modMessage.id,
                        caseID: totalCases,

                        action: ModUtil.CONSTANTS.ACTIONS.MUTE,
                        actionComplete: false,
                        reason: 'No reason specified.',

                        targetID: newUser.user.id,
                        targetTag: newUser.user.tag,
                        modID: muteEntry.executor.id,
                        modTag: muteEntry.executor.tag
                    })
    
                    await this.client.muteManager.addMute(newCase)
                }
            }

            else if (oldUser.roles.cache.has(muteRole) && !newUser.roles.cache.has(muteRole)) {
                const unmuteCase = await Case.findOne({ targetID: newUser.user.id, action: ModUtil.CONSTANTS.ACTIONS.UNMUTE, caseID: totalCases - 1 }).catch(void 0)

                //Unmuted via Unmute Command
                if (unmuteCase && new Date(unmuteCase.createdAt) > new Date().getTimeFromNow((Number(ms('60.15m'))))) {
                    const e = new MessageEmbed()
                        .setAuthor(`User Unmuted | ${newUser.user.tag}`, newUser.user.displayAvatarURL({ dynamic: true, format: 'png' }))
                        .setColor(Colours.Crimson)
                        .setDescription(
                            `[\`${moment(unmuteCase.createdAt).format('HH:mm:ss')}\`] [\`${totalCases}\`] :loud_sound: **${unmuteCase.modTag}** unmuted **${unmuteCase.targetTag}** (ID: ${newUser.user.id})\n` +
                            `\`[ Reason ]:\` ${unmuteCase.reason}`
                        )

                        const modMessage = await modChannel.send({ embeds: [e] }) //The mute was just created specifically by using the mute command

                        unmuteCase.logMessageID = modMessage.id
                        return unmuteCase.save()
                }

                //Unmuted via role remove
                const unmuteEntry = await guild.fetchAuditLogs({ type: 'MEMBER_ROLE_UPDATE', limit: 10 })
                    .then(au => au.entries.find(entry => entry.target === newUser.user && new Date(entry.createdAt) > new Date().getTimeFromNow(Number(ms('10s')))))
                const mod = unmuteEntry ? unmuteEntry.executor : newUser.user
                const userLastMute = await Case.findOne({ targetTag: newUser.user.tag, actionComplete: false, action: ModUtil.CONSTANTS.ACTIONS.MUTE }).catch(void 0)

                const e = new MessageEmbed()
                    .setAuthor(`User Unmuted | ${newUser.user.tag}`, newUser.user.displayAvatarURL({ dynamic: true, format: 'png' }))
                    .setColor(Colours.Crimson)
                    .setDescription(
                        `[\`${moment(unmuteEntry.createdAt).format('HH:mm:ss')}\`] [\`${totalCases}\`] :loud_sound: **${mod.tag}** unmuted **${newUser.user.tag}** (ID: ${newUser.user.id})\n` +
                        '`[ Reason ]:` No reason specified.'
                    )
                    
                const modLogMessage = await modChannel.send({ embeds: [e] })

                await new Case({
                    id: await Case.countDocuments() + 1,
                    guildID: guild.id,
                    logMessageID: modLogMessage.id,
                    caseID: totalCases,
                    
                    action: ModUtil.CONSTANTS.ACTIONS.UNMUTE,
                    actionComplete: false,
                    reason: 'No reason specified.',

                    targetID: newUser.user.id,
                    targetTag: newUser.user.tag,
                    modID: unmuteEntry.executor.id,
                    modTag: unmuteEntry.executor.tag
                }).save()

                return userLastMute ? this.client.queue.add(this.client.muteManager.cancelMute(userLastMute)) : void 0
            }
                
        }
    }
}

//TODO: Optimize whatever this is