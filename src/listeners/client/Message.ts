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
                if ((message.author.id === this.client.ownerID.toString()) || !adminRoles.some(r => message.member.roles.cache.some(role => role === r))) {
                    await this.client.commandHandler.findCommand('warn').exec(message, { member: message.member, reason: 'Automod (Antieveryone)' })
                }
            }
        }

        //Anti-Invite
        if (message.guild && inviteDetection.some(word => message.content.toLowerCase().includes(word))) {
            const antiInvite: boolean = this.client.settings.get(message.guild, 'auto-mod.antiInvite', false)
            const modRole = message.guild.roles.resolve(modRoleID)
            const adminRoles = message.guild.roles.cache.map(rArr => rArr).filter(r => r.permissions.has('ADMINISTRATOR') || r.permissions.has('MANAGE_GUILD'))

            modRole ? adminRoles.push(modRole) : void 0

            if (antiInvite) {
                this.client.logger.log('CAUTION', `REACHED HERE, ${message.author.id === message.guild.ownerID}`)
                if (!(message.author.id === message.guild.ownerID) && !message.member.roles.cache.some(r => adminRoles.some(ar => ar === r))) {
                    await this.client.commandHandler.findCommand('warn').exec(message, { member: message.member, reason: 'Automod (Antiinvite)' })
                }
            }
        }
    }
}

// && !this.client.users.resolve(this.client.ownerID.toString()).dmChannel

//(message.author.id === message.guild.ownerID) || !message.member.roles.cache.some(r => adminRoles.some(ar => ar === r))