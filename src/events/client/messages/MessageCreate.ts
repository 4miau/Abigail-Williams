import { Listener } from 'discord-akairo'
import { Message, MessageEmbed } from 'discord.js'

import Profile from '../../../models/Profile'
import { inviteDetection } from '../../../util/Constants'
import { appendDMFile } from '../../../util/functions/fileaccess'
import { messageHandler, unitTesting } from '../../../handlers'

export default class MessageCreate extends Listener {
    public constructor() {
        super('messagecreate', {
            emitter: 'client',
            event: 'messageCreate',
            category: 'client'
        })
    }

    public async exec(message: Message) {
        if (unitTesting) messageHandler(message)
        
        if (message.author.id === this.client.ownerID && message.content === `<@!${this.client.user.id}> <3`) message.channel.send('<3')

        if (!message.guild) {
            const messages = this.client.dmCache.get(message.author.id) || []
            messages.push(message)
            this.client.dmCache.set(message.author.id, messages)

            if (!message.author.bot && !this.client.isOwner(message.author.id)) {
                this.client.logger.log('INFO', `[DM] ${message.author.tag} (${message.author.id}): ${message.content}`)
                appendDMFile(this.client, message)
            }
        }
        else {
            if (message.author.bot) return
            const guild = message.guild

            if (message.type === 'CHANNEL_PINNED_MESSAGE') message.delete()

            const countChannel = message.guild.channels.resolve(this.client.settings.get(guild, 'count.count-channel', ''))
            if (countChannel && message.channel === countChannel && message.author !== this.client.user) this.counterManager(message)

            if (message.content.includes(guild.roles.everyone.name)) this.autoModManagement(message, 'ANTIEVERYONE')
            if (message.mentions.users) {
                const maxMentions: number = this.client.settings.get(guild, 'auto-mod.maxMentions', 0)
                if (maxMentions) this.autoModManagement(message, 'MAXMENTIONS')
            }
            if (message.content.includes('\n')) this.autoModManagement(message, 'MAXLINES')
            if (inviteDetection.some(word => message.content.toLowerCase().includes(word))) this.autoModManagement(message, 'ANTIINVITE')

            if (this.client.userMap.has(message.author.id)) {
                this.autoModManagement(message, 'ANTISPAM')
            }
            else {
                let fn = setTimeout(() => { this.client.userMap.delete(message.author.id)}, 5000)
                this.client.userMap.set(message.author.id, {
                    messageCount: 1,
                    lastMessage: message,
                    timer: fn
                })
            }

            /*
            const hasProfile = await Profile.findOne({ userID: message.author.id }) ? true : false 

            if (hasProfile) await this.XPManagement(message)
            else this.client.queue.add(this.client.profileManager.createProfile(message.author.id, guild.id))
            */
        }
    }

    private async XPManagement(message: Message) {
        const guildIndex = await Profile.findOne({ userID: message.author.id })?.then(p => p?.guildstats.findIndex(i => i.guild === message.guild.id) || 0)

        if (!guildIndex) this.client.queue.add(this.client.profileManager.updateProfile(message.author.id, message.guild.id))

        if (!this.client.xpAdded.has(message.author.id) && !message.util?.parsed?.command) {
            const xp = Array.prototype.randomRange(8, 15)
            const guildxp = Array.prototype.randomRange(9, 21)

            const globalXPAdded = await this.client.profileManager.addXP(message.author, xp)
            const guildXPAdded = await this.client.profileManager.addXP(message.member, guildxp)

            if (globalXPAdded instanceof MessageEmbed && this.client.settings.get(message.guild, 'levelupmessages', true)) message.channel.send({ embeds: [globalXPAdded] })
            if (guildXPAdded instanceof MessageEmbed && this.client.settings.get(message.guild, 'levelupmessages', true)) message.channel.send({ embeds: [guildXPAdded] })

            setTimeout(async () => { this.client.xpAdded.delete(message.author.id) }, 9e4)
        }
    }
    
    private counterManager(message: Message) {
        const nextCount: number = this.client.settings.get(message.guild, 'count.current-count', 0) + 1
        const lastSender: string = this.client.settings.get(message.guild, 'count.current-sender', '')
        const startOver: boolean = this.client.settings.get(message.guild, 'count.start-over', null)

        if ((message.content !== nextCount.toString() || message.author.id === lastSender) && !startOver) {
             message.react('❌')

            this.client.settings.setArr(message.guild, [
                { key: 'count.current-count', value: 0 },
                { key: 'count.current-sender', value: '' },
                { key: 'count.start-over', value: true }
            ])

            message.channel.send(`**${message.author.tag}** has ruined the count at **${nextCount - 1}!** You will have to start again.`)
        }
        else if (message.content === nextCount.toString() && message.author.id !== lastSender) {
            message.react('✅')

            this.client.settings.setArr(message.guild, [
                { key: 'count.current-count', value: nextCount },
                { key: 'count.current-sender', value: message.author.id },
                { key: 'count.start-over', value: false }
            ])
        }
        else void 0
    }

    private autoModManagement(message: Message, type: AutomodTags) {
        const guild = message.guild
        const member = message.member

        const modRole = guild.roles.resolve(this.client.settings.get(guild, 'modRole', ''))
        const adminRoles = guild.roles.cache.map(rArr => rArr).filter(r => r.permissions.has('ADMINISTRATOR') || r.permissions.has('MANAGE_GUILD'))

        modRole ? adminRoles.push(modRole) : void 0

        const hasAdminRole = member.roles.cache.some(r => adminRoles.some(role => role === r))

        if (type === 'ANTIEVERYONE') {
            if ((message.author.id !== this.client.ownerID.toString()) && !hasAdminRole) 
                return this.client.queue.add(this.client.commandHandler.findCommand('warn').exec(message, { member: message.member, reason: 'Automod (Antieveryone)' }))
        }
        else if (type === 'MAXMENTIONS') {
            const maxMentions: number = this.client.settings.get(guild, 'auto-mod.maxMentions', 0)

            if (message.mentions.users.size > maxMentions && !hasAdminRole)
                return this.client.queue.add(this.client.commandHandler.findCommand('warn').exec(message, { member: message.member, reason: 'Automod (Maxmentions)'}))
        }
        else if (type === 'MAXLINES') {
            const maxLines: number = this.client.settings.get(guild, 'auto-mod.maxLines', 0)

            if (message.content.split(/\r\n|\r|\n/).length > maxLines && maxLines !== 0 && !hasAdminRole)
                return this.client.queue.add(this.client.commandHandler.findCommand('warn').exec(message, { member: message.member, reason: 'Automod (Maxlines)' }))
        }
        else if (type === 'ANTIINVITE') {
            if (message.author.id !== guild.ownerId && !hasAdminRole)
                return this.client.queue.add(this.client.commandHandler.findCommand('warn').exec(message, { member: message.member, reason: 'Automod (Antiinvite)' }))
        }
        else if (type === 'ANTISPAM') {
            const spamLimit = this.client.settings.get(message.guild, 'automod.antispam', 0)
            const spamWhitelist: string[] = this.client.settings.get(message.guild, 'automod.antispam-whitelist', [])

            if (!spamLimit || spamWhitelist.includes(message.channel.id)) return

            const TIME = 5000
            const MAXDIFF = 2000

            const userData = this.client.userMap.get(message.author.id)
            const { lastMessage, timer } = userData
            const diff = message.createdTimestamp - lastMessage.createdTimestamp

            const resetTimer = () => {
                clearTimeout(timer)
                userData.messageCount = 1
                userData.lastMessage = message
                userData.timer = setTimeout(() => { this.client.userMap.delete(message.author.id) }, TIME)
            }

            if (diff > MAXDIFF) {
                resetTimer()
                this.client.logger.log('CAUTION', 'Timeout has been cleared.')
                this.client.userMap.set(message.author.id, userData)
            }
            else {
                let messageCount: number = userData.messageCount
                messageCount++
    
                if (messageCount >= spamLimit) {
                    resetTimer()
                    return this.client.queue.add(this.client.commandHandler.findCommand('warn').exec(message, { member: message.member, reason: 'Automod (Antispam)' }))
                }
                else {
                    userData.messageCount = messageCount
                    this.client.userMap.set(message.author.id, userData)
                }
            }
        }
    }
}