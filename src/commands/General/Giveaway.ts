import { Command } from 'discord-akairo'
import { Message, MessageEmbed } from 'discord.js'
import { Repository } from 'typeorm'
import ms from 'ms'

import { Giveaways } from '../../models/Giveaways'
import GiveawayManager from '../../structures/GiveawayManager'
import { Colours } from '../../util/Colours'
import moment from 'moment'

export default class Giveaway extends Command {
    public constructor() {
        super('giveaway', {
            aliases: ['giveaway', 'ga'],
            category: 'General',
            description: {
                content: 'Start a giveaway (winners must end with w). You must provide winners if you wish to specify the prize.',
                usage: 'giveaway [time] <NoOfWinners>w <prize>',
                examples: ['giveaway 3d 5w discord nitro', 'giveaway 5d'],
            },
            channel: 'guild',
            userPermissions: ['EMBED_LINKS', 'MANAGE_GUILD'],
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
                            if (Number(str.replace('w', '')) > 0 && Number(str.replace('w', '')) < 100) return Number(str)
                        }
                        return 1
                    },
                    match: 'phrase'
                },
                {
                    id: 'prize',
                    type: 'string',
                    match: 'rest'
                }
            ]
        })
    }

    public async exec(message: Message, {time, winners, prize}: {time: number, winners: number, prize: string}): Promise<any> {
        if (!time) return message.util!.send('You need to provide a time for the giveaway.')

        const giveawayRepo: Repository<Giveaways> = this.client.db.getRepository(Giveaways)
        const end: number = Date.now() + time

        const msg: Message = await message.util!.send(new MessageEmbed()
            .setAuthor(`Giveaway | ${prize ? prize : 'A reward.'}`)
            .setColor(Colours.Spring)
            .setDescription(`React with 🎉 to enter!
            Giveaway is hosted by ${message.author}!
            `)
            .setFooter(`Ends at • ${moment(end).utcOffset(1).format('YYYY/M/DD hh:mm:ss')} ${winners > 1 ? ' | ' + winners + ' winners' : ''}`)
        )

        msg.react('🎉')
        message.delete()

        giveawayRepo.insert({
            'channel': message.channel.id,
            'message': msg.id,
            'winners': winners,
            'end': end
        })

        setTimeout(() => { GiveawayManager.end(giveawayRepo, msg)}, time)
    }
}