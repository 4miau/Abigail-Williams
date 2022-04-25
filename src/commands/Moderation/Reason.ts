import { Argument, Command } from 'discord-akairo'
import { Message, TextChannel } from 'discord.js'

import Case from '../../models/Case'

export default class Reason extends Command {
    public constructor() {
        super('reason', {
            aliases: ['reason'],
            category: 'Moderation',
            description: {
                content: 'Changes the reason for a modlog entry.',
                usage: 'reason [caseID] [reason]',
                examples: ['reason 5 False mute'],
            },
            channel: 'guild',
            ratelimit: 3,
            args: [
                {
                    id: 'caseID',
                    type: Argument.union('number')
                },
                {
                    id: 'reason',
                    type: 'string',
                    match: 'rest'
                }
            ]
        })
    }

    //@ts-ignore
    userPermissions(message: Message) {
        const modRole: string = this.client.settings.get(message.guild, 'modRole', '')
        const hasStaffRole = message.member.permissions.has('MANAGE_GUILD', true) || message.member.roles.cache.has(modRole)

        if (!hasStaffRole) return 'Moderator'
        return null
    }

    public async exec(message: Message, {caseID, reason}: {caseID: number, reason: string}): Promise<Message> {
        if (!caseID || !reason) return message.channel.send('Provide a caseID & reason to change the reason of a case.')

        const queriedCase = await Case.findOne({ caseID: caseID, guildID: message.guild.id })
        if (!queriedCase) return message.channel.send('Could not find this case, provide a valid case.')

        queriedCase.reason = reason
        await queriedCase.updateOne(queriedCase)

        const logChannel = message.guild.channels.resolve(this.client.settings.get(message.guild, 'logs.mod-logs', '')) as TextChannel
        if (!logChannel) return message.channel.send('This server has no modlog channel so I can not find the modlog.')

        const logMessage = await logChannel.messages.fetch()
            .then(col => col.find(m => m.id === queriedCase.logMessageID))
            .catch(void 0)

        if (!logMessage) return
        
        const logMessageService = this.client.serviceHandler.modules.get('editlogreason')
        logMessage.edit({ embeds: [logMessageService.exec(logMessage, queriedCase, reason)] })
    }
}