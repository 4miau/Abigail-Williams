import { Command } from 'discord-akairo'
import { Message } from 'discord.js'
import path from 'path'

import { extensions } from '../../util/Constants'

export default class AddEmote extends Command {
    public constructor() {
        super('addemote', {
            aliases: ['addemote', 'addemoji'],
            category: 'General',
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
        const modRole: string = this.client.settings.get(message.guild, 'modRole', '')
        const hasStaffRole = message.member.hasPermission('MANAGE_EMOJIS', { checkAdmin: true, checkOwner: true}) || message.member.roles.cache.has(modRole)

        if (!hasStaffRole) return 'Moderator, or manage emoji permissions.'
        return null
    }

    public async exec(message: Message, {emojiName}: {emojiName: string}): Promise<Message> {
        const attachment = message.attachments.size ? message.attachments.find(file => extensions.includes(path.extname(file.url))) : void 0

        if (!attachment) return message.util!.send('You need to provide an attachment')

        const serverEmojiCount = message.guild.emojis.cache.size

        await message.guild.emojis.create(attachment.url, emojiName ? emojiName : `emoji_${serverEmojiCount + 1}`)
            .then(() => message.util!.send('New emote has been added to the server.')
            .catch(() => message.util!.send('Error uploading the emote, likely because of file size, image size or the passed in attachment.'))
        )
    }
}