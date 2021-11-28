import { Command } from 'discord-akairo'
import { Message, MessageEmbed } from 'discord.js'
import moment, { now } from 'moment'

import { _GetBooruImages } from '../../util/functions/danbooru'

export default class Danbooru extends Command {
    public constructor() {
        super('danbooru', {
            aliases: ['danbooru'],
            category: 'Images',
            description: {
                content: 'Get images from danbooru',
                usage: 'danbooru [tag] <-amount=amount>',
                examples: ['danbooru shimakaze', 'danbooru shimakaze -amount=5'],
            },
            ownerOnly: true,
            ratelimit: 3,
            args: [
                {
                    id: 'tag',
                    type: 'string',
                    match: 'rest'
                },
                {
                    id: 'amount',
                    type: 'number',
                    match: 'option',
                    flag: '-amount='
                }
            ]
        })
    }

    public async exec(message: Message, {tag, amount}: {tag: string, amount: number}): Promise<Message> {
        if (!tag) return message.channel.send('Must provide a tag.')

        const genImage = await _GetBooruImages(tag, amount ? amount : void 0)
        if (!genImage) return message.channel.send('Unable to find any images using this tag, please try again.')

        const e = new MessageEmbed()
            .setDescription('A generated image from Danbooru.')
            .setColor('RANDOM')
            .setImage(genImage.file_url.endsWith('.zip') ? genImage.large_file_url : genImage.file_url)
            .setFooter(`Command ran by ${message.author.tag} • ${moment(now()).utcOffset(1).format('YYYY/MM/DD HH:mm:ss')}`)
        
        return message.channel.send({ embeds: [e] })
    }
}