import { Argument, Command } from 'discord-akairo'
import { Message, MessageEmbed } from 'discord.js'
import { Repository } from 'typeorm'
import ms from 'ms'

import { Case } from '../../models/Case'
import ModUtil from '../../util/ModUtil'

const ACTIONS = {
	1: 'Ban',
	2: 'Unban',
	3: 'Softban',
	4: 'Kick',
	5: 'Mute',
	6: 'Unmute',
	7: 'Embed restriction',
	8: 'Emoji restriction',
	9: 'Reaction restriction',
    10: 'Warn'
} as { [key: number]: string }

export default class Cases extends Command {
    public constructor() {
        super('case', {
            aliases: ['case', 'cases'],
            category: 'Moderation',
            description: {
                content: 'Gets information on a case',
                usage: 'case [caseID]',
                examples: ['case 13'],
            },
            channel: 'guild',
            ratelimit: 3,
            args: [
                {
                    id: 'caseID',
                    type: Argument.union('number', 'string'),
                    prompt: {
                        start: (msg: Message) => `${msg.author}, please provide a caseID.`,
                        retry: (msg: Message) => `${msg.author}, please provide a valid caseID.`,
                        cancel: () => `This command has now been cancelled.`
                    }
                }
            ]
        })
    }

    //@ts-ignore
    userPermissions(message: Message) {
        const modRole: string = this.client.settings.get(message.guild, 'modRole', '')
        const hasStaffRole = message.member.hasPermission('VIEW_AUDIT_LOG', { checkAdmin: true, checkOwner: true}) || message.member.roles.cache.has(modRole)

        if (!hasStaffRole) return 'Moderator'
        return null
    }

    public async exec(message: Message, {caseID}: {caseID: string | number}): Promise<Message> {
        const caseRepo: Repository<Case> = this.client.db.getRepository(Case)

        const totalCases = this.client.settings.get(message.guild, 'totalCases', 0)
        const currCase = caseID === 'latest' ? totalCases : caseID

        if (isNaN(currCase)) return message.util!.send('I would appreciate if you inputted a number.')

        const caseResolved = await caseRepo.findOne({ caseID: currCase })

        if (!caseResolved) return message.util!.send('I was unable to find this case, I do not think it exists. Please provide a valid case.')

        const caseMod = message.guild.members.resolve(caseResolved.modID)
        const colour = Object.keys(ModUtil.CONSTANTS.COLORS).find(k => ModUtil.CONSTANTS.ACTIONS[k] === caseResolved.action)!.trim().toUpperCase()
        const e = new MessageEmbed()
            .setAuthor(`${caseResolved.modTag} (${caseResolved.modID})`, caseMod ? caseMod.user.displayAvatarURL() : '')
            .setColor(ModUtil.CONSTANTS.COLORS[colour])
            .setDescription(`
                **Member:** ${caseResolved.targetTag} (${caseResolved.targetID})
                **Action:** ${ACTIONS[caseResolved.action]}${caseResolved.action === 5 ? `\n**Length:** ${ms(caseResolved.actionDuration.getTime(), { long: true })}` : ''}
                **Reason:** ${caseResolved.reason}${caseResolved.refID ? `\n**Ref case:** ${caseResolved.refID}` : ''}
            `)
            .setFooter(`Case ${caseResolved.caseID}`)
            .setTimestamp(new Date(caseResolved.createdAt));

        return message.util!.send(e)
    }
}