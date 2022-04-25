import { Listener } from 'discord-akairo'
import { Guild, GuildMember, Message, MessageEmbed, Role } from 'discord.js'

import Profiles from '../../../models/Profile'
import { inviteDetection } from '../../../util/Constants'
import { messageHandler, unitTesting } from '../../../handlers/JestHandler'

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

        if (!message.inGuild()) {
            const messages = this.client.dmCache.get(message.author.id) || []
            messages.push(message)
            this.client.dmCache.set(message.author.id, messages)

            if (!message.author.bot && !this.client.isOwner(message.author.id)) {
                this.client.logger.log('INFO', `[DM] ${message.author.tag} (${message.author.id}): ${message.content}`)
                const dmFileService = this.client.serviceHandler.modules.get('appenddmfile')
                dmFileService.exec(message)
            }
        }
        else {
            if (message.author.bot) return
            const guild = message.guild

            if (message.type === 'CHANNEL_PINNED_MESSAGE') message.delete().catch(() => void 0)

            const countChannel = message.guild.channels.resolve(this.client.settings.get(guild, 'count-channel', ''))
            if (countChannel && message.channel === countChannel && message.author !== this.client.user) this.counterManager(message)

            //AUTOMOD CONDITIONS
            if (message.content.includes(guild.roles.everyone.name)) this.automodManager(message, 'ANTIEVERYONE')

            if (message.mentions.users) this.automodManager(message, 'MAXMENTIONS')

            if (message.content.includes('\n')) this.automodManager(message, 'MAXLINES')

            if (inviteDetection.some(inv => message.content.toLowerCase().includes(inv))) this.automodManager(message, 'ANTIINVITE')

            if (this.client.userMap.has(message.author.id)) this.automodManager(message, 'ANTISPAM')
            else {
                let fn = setTimeout(() => { this.client.userMap.delete(message.author.id)}, 5000)
                this.client.userMap.set(message.author.id, { messageCount: 1, lastMessage: message, timer: fn })
            }
            //

            /*
            const hasProfile = await Profile.findOne({ userID: message.author.id }) ? true : false 

            if (hasProfile) await this.XPManagement(message)
            else this.client.queue.add(this.client.profileManager.createProfile(message.author.id, guild.id))
            */
        }
    }

    private async XPManagement(message: Message) {
        const guildIndex = await Profiles.findOne({ userID: message.author.id })?.then(p => p?.guildstats.findIndex(i => i.guild === message.guild.id) || 0)

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
        const nextCount: number = this.client.settings.get(message.guild, 'current-count', 0) + 1
        const lastSender: string = this.client.settings.get(message.guild, 'count-sender', '')
        const startOver: boolean = this.client.settings.get(message.guild, 'reset-count', null)

        if ((message.content !== nextCount.toString() || message.author.id === lastSender) && !startOver) {
             message.react('❌')

            this.client.settings.setArr(message.guild, [
                { key: 'current-count', value: 0 },
                { key: 'count-sender', value: '' },
                { key: 'reset-count', value: true }
            ])

            message.channel.send(`**${message.author.tag}** has ruined the count at **${nextCount - 1}!** You will have to start again.`)
        }
        else if (message.content === nextCount.toString() && message.author.id !== lastSender) {
            message.react('✅')

            this.client.settings.setArr(message.guild, [
                { key: 'current-count', value: nextCount },
                { key: 'count-sender', value: message.author.id },
                { key: 'reset-count', value: false }
            ])
        }
        else void 0
    }

    private automodManager(message: Message, type: AutomodTags) {
        const guild = message.guild
        const member = message.member

        const adminRoles = this.getModRoles(guild)
        const hasAdminRole = this.hasAdminRole(member, adminRoles)
    
        const warnCommand = this.client.commandHandler.findCommand('warn')
        const addWarn = (reason: string) => { this.client.queue.add(warnCommand.exec(message, { member: member, reason: reason })) }

        if (hasAdminRole) return
    
        switch (type) {
            case 'ANTIEVERYONE': {
                const antiEveryone: boolean = this.client.settings.get(guild, 'auto-mod.antiEveryone', false)

                return ((member.user.id !== guild.ownerId) && antiEveryone) ? addWarn('Automod (Antieveryone)') : void 0
            }
            case 'MAXMENTIONS': {
                const maxMentions: number = this.client.settings.get(guild, 'auto-mod.maxMentions', 0)

                return (message.mentions.users.size > maxMentions && maxMentions) ? addWarn('Automod (Maxmentions)') : void 0
            }
            case 'MAXLINES': {
                const maxLines: number = this.client.settings.get(guild, 'auto-mod.maxLines', 0)

                return (message.content.split(/\r\n|\r|\n/).length > maxLines && maxLines) ? addWarn('Automod (Maxlines)') : void 0
            }
            case 'ANTIINVITE': {
                const antiInvite: boolean = this.client.settings.get(guild, 'auto-mod.antiInvite', false)

                return (member.user.id !== guild.ownerId && antiInvite) ? addWarn('Automod (AntiInvite)') : void 0
            }
            case 'ANTISPAM': {
                const spamThreshold: number = this.client.settings.get(guild, 'auto-mod.antiSpam', 0)

                return (spamThreshold) ? this.spamHandler(message) : void 0
            }
            default: { break }
        }
    }

    /*
        AUTOMOD UTIL FUNCTIONS
    */

    private getModRoles(guild: Guild) {
        const modRole = guild.roles.resolve(this.client.settings.get(guild, 'modRole', ''))
        const adminRoles = guild.roles.cache.map(roleArr => roleArr).filter(r => r.permissions.has('ADMINISTRATOR') || r.permissions.has('MANAGE_GUILD'))
        modRole ? adminRoles.push(modRole) : void 0

        return adminRoles
    }

    private hasAdminRole(member: GuildMember, roles: Role[]) { return member.roles.cache.some(r => roles.some(role => role === r)) }

    private spamHandler(message: Message) {
        const guild = message.guild
        const authorId = message.author.id

        const warnCommand = this.client.commandHandler.findCommand('warn')
        const addWarn = (reason: string) => { this.client.queue.add(warnCommand.exec(message, { member: message.member, reason: reason })) }

        const limit: number = this.client.settings.get(guild, 'auto-mod.antispam', 0)
        const whitelist: string[] = this.client.settings.get(guild, 'auto-mod.antispam-whitelist', [])

        if (!limit || whitelist.includes(message.channelId)) return

        const TIME = 5000
        const MAXDIFF = 2000

        const userData = this.client.userMap.get(authorId)
        const { lastMessage, timer } = userData
        const diff = message.createdTimestamp - lastMessage.createdTimestamp

        const resetTimer = () => {
            clearTimeout(timer)
            userData.messageCount = 1
            userData.lastMessage = message
            userData.timer = setTimeout(() => { this.client.userMap.delete(authorId) }, TIME)
        }

        if (diff > MAXDIFF) {
            resetTimer()
            this.client.userMap.set(authorId, userData)
        }
        else {
            let messageCount: number = userData.messageCount
            messageCount++

            if (messageCount >= limit) {
                resetTimer()
                addWarn('Automod (Antispam)')
            }
            else {
                userData.messageCount = messageCount
                this.client.userMap.set(authorId, userData)
            }
        }
    }
}

//TODO: Convert methods into services