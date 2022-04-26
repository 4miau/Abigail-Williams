import { Argument, Command } from 'discord-akairo'
import { Message } from 'discord.js'

export default class SetAvatar extends Command {
    public constructor() {
        super('setavatar', {
            aliases: ['setavatar'],
            category: 'Owner',
            description: {
                content: 'Sets a new avatar for me! (Provide a direct link or attachment)',
                usage: 'setavatar [attachment/link]',
                examples: ['setavatar https://imgur.com/image.png'],
            },
            channel: 'guild',
            ratelimit: 3,
            args: [
                {
                    id: 'image',
                    type: Argument.union('url', 'string')
                }
            ]
        })
    }

    public async exec(message: Message, {image}): Promise<Message> {
        if (!image && !message.attachments.size) return message.util.send('You need to provide a file or link to set my new avatar.')
        if (image && message.attachments.size) return message.util.send('You really shouldn\'t try to use both...')

        if (typeof image === 'string' && image?.toLowerCase() === 'none') {
            this.client.user.setAvatar(this.client.user.defaultAvatarURL)
            return message.util.send('Removed the current avatar.')
        }

        if (image) {
            try {
                await this.client.user.setAvatar((image as URL).href)
                return message.util.send('I have set the new image.')
            } catch {
                return message.util.send('You need to provide a valid direct link to be able to change my avatar.')
            }
        }
        else {
            try {
                await this.client.user.setAvatar(message.attachments.first().url)
                return message.util.send('I have set the new image.')
            } catch {
                return message.util.send('You need to provide a valid image attachment to be able to change my avatar.')
            }
        }
    }
}