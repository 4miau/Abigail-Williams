import { Command } from 'discord-akairo'
import { Message, MessageEmbed } from 'discord.js'
import ms from 'ms'

import Giveaways from '../../models/Giveaways'
import GiveawayManager from '../../structures/GiveawayManager'
import { Colours } from '../../util/Colours'
import moment from 'moment'

export default class Giveaway extends Command {
    public constructor() {
        super('giveaway', {
            aliases: ['giveaway', 'ga'],
            category: 'Configuration',
            description: {
                content: 'Start a giveaway (winners must end with w). You must provide winners if you wish to specify the prize.',
                usage: 'giveaway [time] <NoOfWinners>w <prize>',
                examples: ['giveaway 3d 5w discord nitro', 'giveaway 5d'],
            },
            channel: 'guild',
            ratelimit: 3,
            args: [
                {
                    id: 'time',
                    type: (_: Message, str: string): null | number => {
                        if (Number(ms(str))) return Number(ms(str))
                        return null
                    },
                    match: 'phrase',
                    prompt: {
                        start: (msg: Message) => `${msg.author}, please provide a time for the giveaway.`,
                        retry: (msg: Message) => `${msg.author}, please provide a valid time for the giveaway.`,
                        cancel: () => 'This command has now been cancelled.'
                    }
                },
                {
                    id: 'winners',
                    type: (_: Message, str: string): number => {
                        if (str.endsWith('w')) {
                            if (Number(str.replace('w', '')) > 0 && Number(str.replace('w', '')) < 100) return Number(str.replace('w', ''))
                        }
                        return 1
                    },
                    match: 'phrase'
                },
                {
                    id: 'prize',
                    type: 'string',
                    match: 'rest',
                    default: 'A reward.'
                }
            ]
        })
    }

    //@ts-ignore
    userPermissions(message: Message) {
        const modRole = this.client.settings.get(message.guild, 'modRole', '')
        const hasStaffRole = message.member.permissions.has('MANAGE_GUILD', true) || message.member.roles.cache.has(modRole)

        if (!hasStaffRole) return 'Moderator'
        return null
    }

    public async exec(message: Message, {time, winners, prize}: {time: number, winners: number, prize: string}): Promise<any> {
        if (!time) return message.channel.send('You need to provide a time for the giveaway.')

        const end: number = Date.now() + time

        const e = new MessageEmbed()
            .setAuthor(`Giveaway | ${prize}`)
            .setColor(Colours.Spring)
            .setDescription(`React with 🎉 to enter!
                Giveaway is hosted by ${message.author}!
            `)
            .setFooter(`Ends at • ${moment(end).utcOffset(1).format('YYYY/M/DD HH:mm:ss')} ${winners > 1 ? ' | ' + winners + ' winners' : ''}`)

        const msg: Message = await message.channel.send({ embeds: [e] })

        msg.react('🎉')
        message.delete()

        Giveaways.create({
            channel: message.channel.id,
            message: msg.id,
            reward: prize,
            winners: winners,
            end: end
        })

        this.client.logger.log('CAUTION', `${msg.id}`)

        setTimeout(() => { GiveawayManager.end(msg)}, time)
    }
}