import { Listener } from 'discord-akairo'
import { GuildMember, Message, MessageEmbed, TextChannel } from 'discord.js'
import moment from 'moment'

import { Case } from '../../models/Case'
import { Colours } from '../../util/Colours'
import ModUtil from '../../util/ModUtil'

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
        const gtc: TextChannel = this.client.channels.cache.get('842906441458384926') as TextChannel

        //User-logs (username + nickname)
        const userLogsChannel = guild.channels.resolve(this.client.settings.get(guild, 'logs.user-logs.channel', '')) as TextChannel
        const userLogs: boolean[] = this.client.settings.getArr(guild, [
            { key: 'logs.user-logs.username', defaultValue: false},
            { key: 'logs.user-logs.nickname', defaultValue: false},
        ])

        const e = new MessageEmbed()
            .setAuthor(`User Update | ${newUser.user.tag}`)
            .setColor(Colours.Coral)
            .setThumbnail(newUser.user.displayAvatarURL({ dynamic: true, format: 'png' }))

        if (userLogs.some(e => e === true) && userLogsChannel) {
            if (userLogs[0] && oldUser.user.tag !== newUser.user.tag) {
                e.addField('Old username & tag:', `${oldUser.user.username} (${oldUser.user.tag})`)
                e.addField('New username & tag:', `${newUser.user.username} (${newUser.user.tag})`)

                await gtc.send(e)
                await userLogsChannel.send(e)
            }
            if (userLogs[1] && oldUser.nickname !== newUser.nickname) {
                e.fields.length > 0 ? e.spliceFields(0, e.fields.length) : void 0
                e.addField('Old nickname:', `${oldUser.nickname ? oldUser.nickname : 'No nickname'} (${oldUser.user.tag})`)
                e.addField('New nickname:', `${newUser.nickname ? newUser.nickname : 'No nickname'} (${newUser.user.tag})`)

                userLogsChannel.send(e)

                e.setDescription(`**Server:** ${guild.name} (${guild.id})`)
                gtc.send(e)
            }
        }

        /* Modlogs */
        const modLogChannel = guild.channels.resolve(this.client.settings.get(guild, 'logs.mod-logs', '')) as TextChannel
        const muteRole = this.client.settings.get(guild, 'muteRole', '')

        //Muted via Command
        if (modLogChannel) {
            if (!oldUser.roles.cache.has(muteRole) && newUser.roles.cache.has(muteRole)) {
                const totalCases = this.client.settings.get(guild, 'totalCases', 0) + 1
                const caseRepo = this.client.db.getRepository(Case)
                const muteCase = await caseRepo.findOne({ targetID: newUser.user.id, action: ModUtil.CONSTANTS.ACTIONS.MUTE, caseID: totalCases - 1}).catch(void 0)
    
                if (muteCase) { //The mute was just created specifically by using the mute command
                    const e = new MessageEmbed()
                        .setAuthor(`User Muted | ${newUser.user.tag}`, newUser.user.displayAvatarURL({ dynamic: true, format: 'png' }))
                        .setColor(Colours.Crimson)
                        .setDescription(
                            `[\`${moment(muteCase.createdAt).format('HH:mm:ss')}\`] [\`${totalCases}\`] :mute: **${muteCase.modTag}** muted **${muteCase.targetTag}** (ID: ${newUser.user.id})\n` +
                            `\`[ Reason ]:\` ${muteCase.reason}`
                        )
                        .setFooter('Powered by the cutie miau!')
    
                    await modLogChannel.send(e)
                }
    
                //Muted via role add
                const muteAuditLog = await guild.fetchAuditLogs({ type: 'MEMBER_ROLE_UPDATE', user: newUser, limit: 10 }).then(ae => ae.entries.first())
                const moderator = muteAuditLog.executor
                
                const e = new MessageEmbed()
                    .setAuthor(`User Muted | ${newUser.user.tag}`, newUser.user.displayAvatarURL({ dynamic: true, format: 'png' }))
                    .setColor(Colours.Crimson)
                    .setDescription(
                        `[\`${moment(muteAuditLog.createdAt).format('HH:mm:ss')}\`] [\`${totalCases}\`] :mute: **${moderator.tag}** muted **${newUser.user.tag}** (ID: ${newUser.user.id})\n` +
                        `\`[ Reason ]:\` No reason specified.`
                    )
    
                const modLogMessage = await modLogChannel.send(e)
    
                const newCase = new Case()
    
                newCase.guildID = guild.id
                newCase.messageID = modLogMessage.id
                newCase.caseID = totalCases
    
                newCase.action = ModUtil.CONSTANTS.ACTIONS.MUTE
                newCase.actionComplete = false
                newCase.reason = 'No reason specified.'
    
                newCase.targetID = newUser.user.id
                newCase.targetTag = newUser.user.tag
                newCase.modID = muteAuditLog.executor.id
                newCase.modTag = muteAuditLog.executor.tag
    
                await this.client.muteManager.addMute(newCase)           
            }
            //Unmuted via command
            else if (oldUser.roles.cache.has(muteRole) && !newUser.roles.cache.has(muteRole) && modLogChannel) { 
                const totalCases = this.client.settings.get(guild, 'totalCases', 0) + 1
                const caseRepo = this.client.db.getRepository(Case)
                const unmuteCase = await caseRepo.findOne({ targetID: newUser.user.id, action: ModUtil.CONSTANTS.ACTIONS.UNMUTE, caseID: totalCases - 1 }).catch(void 0)

                if (unmuteCase) {
                    const e = new MessageEmbed()
                        .setAuthor(`User Unmuted | ${newUser.user.tag}`, newUser.user.displayAvatarURL({ dynamic: true, format: 'png' }))
                        .setColor(Colours.Crimson)
                        .setDescription(
                            `[\`${moment(unmuteCase.createdAt).format('HH:mm:ss')}\`] [\`${totalCases}\`] :loud_sound: **${unmuteCase.modTag}** muted **${unmuteCase.targetTag}** (ID: ${newUser.user.id})\n` +
                            `\`[ Reason ]:\` ${unmuteCase.reason}`
                        )
                        .setFooter('Powered by the cutie miau!')

                    modLogChannel.send(e)
                }

                //Unmuted via role remove
                const muteAuditLog = await guild.fetchAuditLogs({ type: 'MEMBER_ROLE_UPDATE', user: newUser, limit: 10 }).then(ae => ae.entries.first())
                const moderator = muteAuditLog.executor
                const userLastMute = await caseRepo.findOne({ targetTag: newUser.user.tag, actionComplete: false, action: ModUtil.CONSTANTS.ACTIONS.MUTE }).catch(void 0)

                const e = new MessageEmbed()
                    .setAuthor(`User Unmuted | ${newUser.user.tag}`, newUser.user.displayAvatarURL({ dynamic: true, format: 'png' }))
                    .setColor(Colours.Crimson)
                    .setDescription(
                        `[\`${moment(muteAuditLog.createdAt).format('HH:mm:ss')}\`] [\`${totalCases}\`] :mute: **${moderator.tag}** muted **${newUser.user.tag}** (ID: ${newUser.user.id})\n` +
                        `\`[ Reason ]:\` No reason specified.`
                    )

                const modLogMessage = await modLogChannel.send(e)

                const newCase = new Case()
    
                newCase.guildID = guild.id
                newCase.messageID = modLogMessage.id
                newCase.caseID = totalCases
    
                newCase.action = ModUtil.CONSTANTS.ACTIONS.UNMUTE
                newCase.actionComplete = false
                newCase.reason = 'No reason specified.'
    
                newCase.targetID = newUser.user.id
                newCase.targetTag = newUser.user.tag
                newCase.modID = muteAuditLog.executor.id
                newCase.modTag = muteAuditLog.executor.tag

                await caseRepo.save(newCase)
                await this.client.muteManager.cancelMute(userLastMute)
            }
        }


    }
}