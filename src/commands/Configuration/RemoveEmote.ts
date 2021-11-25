import { Command } from 'discord-akairo'
import { GuildEmoji, Message } from 'discord.js'

export default class RemoveEmote extends Command {
    public constructor() {
        super('removeemote', {
            aliases: ['removeemote', 'removeemoji'],
            category: 'Configuration',
            description: {
                content: 'Removes an existing emote from the server.',
                usage: 'removeemote [emoteName]',
                examples: ['removeemote facepalm'],
            },
            channel: 'guild',
            ratelimit: 3,
            args: [
                {
                    id: 'emoji',
                    type: 'emoji',
                    match: 'rest',
                }
            ]
        })
    }

    //@ts-ignore
    userPermissions(message: Message) {
        const modRole = this.client.settings.get(message.guild, 'modRole', '')
        const hasStaffRole = message.member.permissions.has('MANAGE_EMOJIS_AND_STICKERS', true) || message.member.roles.cache.has(modRole)

        if (!hasStaffRole) return 'Moderator'
        return null
    }

    public async exec(message: Message, {emoji}: {emoji: GuildEmoji}): Promise<Message> {
        if (!emoji) return message.channel.send('I can\'t really remove an emote if you don\'t provide the name/id.')

        try {
            await message.guild.emojis.cache.find(e => e === emoji).delete()
            return message.channel.send(`I have removed the emote \`${emoji.name}\` from the server.`)
        } catch {
            return message.channel.send('Error removing the provided emote, please try again.')
        }
    }
}