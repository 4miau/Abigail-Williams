import moment from 'moment'
import { Message } from 'discord.js'

import { ICase } from '../../models/Case'
import Service from '../../modules/Service'

export default class EditLogReason extends Service {
    public constructor() {
        super('editlogreason', {
            category: 'GuildSync'
        })
    }

    exec(message: Message, oldCase: ICase, reason: string): any {
        const caseAt = moment(oldCase.createdAt).format('HH:mm:ss')

        const desc = {
            1: () => { return message.embeds[0].setDescription('') },
            2: () => { return message.embeds[0].setDescription('') },
            3: () => { return message.embeds[0].setDescription('') },
            4: () => { return message.embeds[0].setDescription('') },
            5: () => { 
                return message.embeds[0].setDescription(
                    `[\`${caseAt}\`] [\`${oldCase.caseID}\`] :mute: **${oldCase.modTag}** muted **${oldCase.targetTag}** (ID: ${oldCase.targetID})\n` +
                    `\`[ Reason ]:\` ${reason}`
                ) 
            },
            6: () => { 
                return message.embeds[0].setDescription(
                    `[\`${caseAt}\`] [\`${oldCase.caseID}\`] :loud_sound: **${oldCase.modTag}** unmuted **${oldCase.targetTag}** (ID: ${oldCase.targetID})\n` +
                    `\`[ Reason ]:\` ${reason}`
                ) 
            },
            7: () => { return message.embeds[0].setDescription('') },
            8: () => { return message.embeds[0].setDescription('') },
            9: () => { return message.embeds[0].setDescription('') },
        }

        return desc[oldCase.action].call()
    }
}