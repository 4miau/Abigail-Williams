import { Command } from 'discord-akairo'
import { Message } from 'discord.js'
import path from 'path'

import { extensions } from '../../util/Constants'

export default class AddEmote extends Command {
    public constructor() {
        super('addemote', {
            aliases: ['addemote', 'addemoji'],
            category: 'Configuration',
            description: {
                content: 'Adds an emote to the server from an attachment (so attach an image). You can optionally provide a name for the emote.',
                usage: 'addemote <emoteName>',
                examples: ['addemote facepalm'],
            },
            channel: 'guild',
            ratelimit: 3,
            args: [
                {
                    id: 'emojiName',
                    type: 'string',
                    match: 'rest',
                    default: null
                }
            ]
        })
    }

    //@ts-ignore
    userPermissions(message: Message) {
        const modRole = this.client.settings.get(message.guild, 'modRole', '')
        const hasStaffRole = message.member.permissions.has('MANAGE_EMOJIS_AND_STICKERS', true) || message.member.roles.cache.has(modRole)

        if (!hasStaffRole) return 'Moderator, or manage emoji permissions.'
        return null
    }

    public async exec(message: Message, {emojiName}: {emojiName: string}): Promise<Message> {
        const attachment = message.attachments.size ? message.attachments.find(file => extensions.includes(path.extname(file.url))) : void 0

        if (!attachment) return message.channel.send('You need to provide an attachment')

        const serverEmojiCount = message.guild.emojis.cache.size

        await message.guild.emojis.create(attachment.url, emojiName ? emojiName : `emoji_${serverEmojiCount + 1}`)
            .then(() => message.channel.send(`New emoji ${emojiName} has been added to the server successfully.`)
            .catch(() => message.channel.send('Error uploading the emote, likely because of file size, image size or issue with the passed in attachment.'))
        )
    }
}