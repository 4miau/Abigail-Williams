import { Command } from 'discord-akairo'
import { MessageEmbed, TextChannel, Message } from 'discord.js'
import moment from 'moment'

import { Colours } from '../../util/Colours'

export default class Notice extends Command {
    public constructor() {
        super('notice', {
            aliases: ['notice', 'newnotice'],
            category: 'Owner',
            description: {
                content: 'Creates a new notice message for servers.',
                usage: 'notice [content]',
                examples: ['notice New bot feature!'],
            },
            ownerOnly: true,
            channel: 'guild',
            ratelimit: 3,
            args: [
                {
                    id: 'content',
                    type: 'string',
                    match: 'rest'
                }
            ]
        })
    }

    public async exec(message: Message, {content}: {content: string}): Promise<Message> {
        if (!content) return message.util!.send('You might want to add a message to send as a notice.')

        this.client.guilds.cache.forEach(async g => {
            const noticeChannel = g.channels.resolve(this.client.settings.get(g, 'server-notices', '')) as TextChannel

            if (!noticeChannel) return;

            const e = new MessageEmbed()
                .setAuthor('New Bot Notice | Abigail Williams', this.client.user.displayAvatarURL({ dynamic: true, format: 'png' }))
                .setThumbnail(this.client.user.displayAvatarURL({ dynamic: true, format: 'png' }))
                .setColor(Colours.Purple)
                .setDescription(content)
                .setFooter(`Powered by the cutie Miau - ${moment(message.createdAt).utcOffset(1).format('YYYY/MM/DD HH:mm:ss')}`)

            await noticeChannel.send(e)
        })
        
        return message.util!.send('New announcement has been posted to all channels that have a notice channel set.')
    }
}