import { Argument, Command } from 'discord-akairo'
import { Message, MessageEmbed } from 'discord.js'
import ms from 'ms'

import Case from '../../models/Case'
import ModUtil from '../../util/structures/ModUtil'

const ACTIONS = ({
	1: 'ban',
	2: 'unban',
	3: 'kick',
	4: 'kick',
	5: 'mute',
    6: 'unmute',
	7: 'restriction',
	8: 'warn',
	9: 'pardon'
}) as { [key: number]: string }

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
                        cancel: () => 'This command has now been cancelled.'
                    }
                }
            ]
        })
    }

    //@ts-ignore
    userPermissions(message: Message) {
        const modRole = this.client.settings.get(message.guild, 'modRole', '')
        const hasStaffRole = message.member.permissions.has('VIEW_AUDIT_LOG', true) || message.member.roles.cache.has(modRole)

        if (!hasStaffRole) return 'Moderator'
        return null
    }

    public async exec(message: Message, {caseID}: {caseID: string | number}): Promise<Message> {
        const totalCases = this.client.settings.get(message.guild, 'totalCases', 0)
        const currCase = caseID === 'latest' ? totalCases : caseID

        if (isNaN(currCase)) return message.channel.send('I would appreciate if you inputted a number.')

        const caseQuery = await Case.findOne({ caseID: currCase, guildID: message.guild.id })

        if (!caseQuery) return message.channel.send('I was unable to find this case, I do not think it exists. Please provide a valid case.')

        const caseMod = message.guild.members.resolve(caseQuery.modID)
        const colour = Object.keys(ModUtil.CONSTANTS.COLORS).find(k => ModUtil.CONSTANTS.ACTIONS[k] === caseQuery.action)!.trim().toUpperCase()
        const e = new MessageEmbed()
            .setAuthor(`${caseQuery.modTag} (${caseQuery.modID})`, caseMod ? caseMod.user.displayAvatarURL() : '')
            .setColor(ModUtil.CONSTANTS.COLORS[colour])
            .setDescription(`
                **Member:** ${caseQuery.targetTag} (${caseQuery.targetID})
                **Action:** ${ACTIONS[caseQuery.action]}${caseQuery.action === 5 ? '\n**Length:** ' + ms(caseQuery.actionDuration.getTime(), { long: true }) : ''}
                **Reason:** ${caseQuery.reason}${caseQuery.refID ? '\n**Ref case:** ' + caseQuery.refID : ''}
            `)
            .setFooter(`Case ${caseQuery.caseID}`)
            .setTimestamp(new Date(caseQuery.createdAt))

        return message.channel.send({ embeds: [e] })
    }
}