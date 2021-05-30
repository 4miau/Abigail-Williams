import { Listener } from 'discord-akairo'
import { DMChannel, Message } from 'discord.js'

import { inviteDetection } from '../../util/Constants'
import { appendDMFile } from '../../util/Functions'

export default class MessageListener extends Listener {
    public constructor() {
        super('messagelistener', {
            event: 'message',
            emitter: 'client',
            type: 'client'
        })
    }

    public async exec(message: Message) {
        const modRoleID: string = this.client.settings.get(message.guild, 'modRole', '')
        
        //Used to check if the bot is alive
        if (message.author.id === this.client.ownerID && message.content === `<@!${this.client.user.id}> <3`) message.channel.send('<3')

        //Log DMs
        if (message.channel instanceof DMChannel && !message.author.bot) {
            this.client.logger.log('INFO', `[DM] ${message.author.tag} (${message.author.id}): ${message.content}`)
            appendDMFile(this.client, message)
        } 

        //Anti-Everyone
        if (message.guild && (message.content.includes(message.guild.roles.everyone.name))) {
            const antiEveryone: boolean = this.client.settings.get(message.guild, 'auto-mod.antiEveryone', false)
            const modRole = message.guild.roles.resolve(modRoleID)
            const adminRoles = message.guild.roles.cache.map(rArr => rArr).filter(r => r.permissions.has('ADMINISTRATOR') || r.permissions.has('MANAGE_GUILD'))

            modRole ? adminRoles.push(modRole) : void 0

            if (antiEveryone) {
                if ((message.author.id === this.client.ownerID.toString()) || !adminRoles.some(r => message.member.roles.cache.some(role => role === r)))
                    this.client.queue.add(this.client.commandHandler.findCommand('warn').exec(message, { member: message.member, reason: 'Automod (Antieveryone)' }))
            }
        }

        //Max Mentions
        if (message.mentions.users) {
            const maxMentions: number = this.client.settings.get(message.guild, 'auto-mod.maxMentions', 0)

            if (maxMentions && maxMentions > 0 && message.mentions.users.size > maxMentions)
                this.client.queue.add(this.client.commandHandler.findCommand('warn').exec(message, { member: message.member, reason: 'Automod (Maxmentions)'}))
        }

        //Max Lines
        if (message.content.includes('\n')) {
            const maxLines: number = this.client.settings.get(message.guild, 'auto-mod.maxLines', 0)
            const modRole = message.guild.roles.resolve(modRoleID)
            const adminRoles = message.guild.roles.cache.map(rArr => rArr).filter(r => r.permissions.has('ADMINISTRATOR') || r.permissions.has('MANAGE_GUILD'))

            modRole ? adminRoles.push(modRole) : void 0

            if (maxLines !== 0 && message.content.split(/\r\n|\r|\n/).length > maxLines) {
                if (!(message.author.id === message.guild.ownerID) && !message.member.roles.cache.some(r => adminRoles.some(ar => ar === r))) 
                    this.client.queue.add(this.client.commandHandler.findCommand('warn').exec(message, { member: message.member, reason: 'Automod (Maxlines)' }))
            }
        }

        //Anti-Invite
        if (message.guild && inviteDetection.some(word => message.content.toLowerCase().includes(word))) {
            const antiInvite: boolean = this.client.settings.get(message.guild, 'auto-mod.antiInvite', false)
            const modRole = message.guild.roles.resolve(modRoleID)
            const adminRoles = message.guild.roles.cache.map(rArr => rArr).filter(r => r.permissions.has('ADMINISTRATOR') || r.permissions.has('MANAGE_GUILD'))

            modRole ? adminRoles.push(modRole) : void 0

            if (antiInvite) {
                if (!(message.author.id === message.guild.ownerID) && !message.member.roles.cache.some(r => adminRoles.some(ar => ar === r))) 
                    this.client.queue.add(this.client.commandHandler.findCommand('warn').exec(message, { member: message.member, reason: 'Automod (Antiinvite)' }))
            }
        }
    }
}