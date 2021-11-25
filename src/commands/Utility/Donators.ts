import { Command } from 'discord-akairo'
import { Message, MessageEmbed } from 'discord.js'

import MemberData from '../../models/MemberData'
import { Colours } from '../../util/Colours'

export default class Donators extends Command {
    public constructor() {
        super('donators', {
            aliases: ['donators'],
            category: 'Utility',
            description: {
                content: 'Lists all the donators and premium users of the bot.',
                usage: 'donators <pageNo>',
                examples: ['donators', 'donators 3'],
            },
            channel: 'guild',
            ratelimit: 3,
            args: [
                {
                    id: 'page',
                    type: 'number',
                    default: 1
                }
            ]
        })
    }

    public async exec(message: Message, {page}: {page: number}): Promise<Message> {
        const premiumUsers = await MemberData.find({ premiumUser: true })

        const donors = premiumUsers.paginate(page, 10)

        const e = new MessageEmbed()
            .setAuthor('Donators', this.client.user.displayAvatarURL({ dynamic: true }))
            .setColor(Colours.Green)
            .setThumbnail(this.client.user.displayAvatarURL({ dynamic: true }))
            .setDescription(
                !donors[0].arrayEmpty() ?
                    donors[0].map(d => `\`${d.memberTag} (${d.memberID})\``).join('\n') :
                    'No donators ' + (page > 1 ? `on page ${page}` : 'presently.')
            )

        return message.channel.send({ embeds: [e] })
    }
}