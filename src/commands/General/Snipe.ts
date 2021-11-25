import { Command } from 'discord-akairo'
import { Message, MessageEmbed } from 'discord.js'
import moment, { now } from 'moment'

import { Colours } from '../../util/Colours'

export default class Snipe extends Command {
    public constructor() {
        super('snipe', {
            aliases: ['snipe'],
            category: 'General',
            description: {
                content: 'Snipes the last deleted message.',
                usage: 'snipe',
                examples: ['snipe'],
            },
            ratelimit: 3,
        })
    }

    public async exec(message: Message): Promise<Message> {
        const snipe = this.client.snipes.get(message.channel.id)

        if (snipe) {
            this.client.snipes.delete(message.channel.id)

            const e = new MessageEmbed()
                .setAuthor(`${snipe.author}`, snipe.member.user.displayAvatarURL())
                .setDescription(snipe.content)
                .setColor(Colours.Mint)
                .setFooter(moment(now()).utcOffset(1).format('YYYY/MM/DD hh:mm:ss'))

            return message.channel.send({ embeds: [e] })
        }

        return message.channel.send('There\'s nothing to snipe.')
    }
}