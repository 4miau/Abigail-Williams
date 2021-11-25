import { Argument, Command } from 'discord-akairo'
import { Message } from 'discord.js'

export default class StarEmoji extends Command {
    public constructor() {
        super('staremoji', {
            aliases: ['staremoji', 'staremote', 'setstaremoji'],
            category: 'Starboard',
            description: {
                content: 'Changes the guild\'s emoji for interacting with the starboard. (Custom emojis must be from the same server)',
                usage: 'staremoji [emoji]',
                examples: ['staremoji ✨', 'staremoji :star2:'],
            },
            channel: 'guild',
            ratelimit: 3,
            args: [
                {
                    id: 'emoji',
                    type: Argument.union('emote', 'emoji'),
                    match: 'rest'
                }
            ]
        })
    }

    //@ts-ignore
    userPermissions(message: Message) {
        const modRole: string = this.client.settings.get(message.guild, 'modRole', '')
        const hasStaffRole = message.member.permissions.has('MANAGE_GUILD', true) || message.member.roles.cache.has(modRole)

        if (!hasStaffRole) return 'Staff role, Manage Guild or Administrator missing.'
        return null
    }

    public exec(message: Message, {emoji}): Promise<Message> {
        if (!emoji) return message.channel.send('You must provide an emoji to change the current guild\'s set emoji.')

        this.client.settings.set(message.guild, 'starboard.emoji', emoji)
        return message.channel.send(`${emoji} has been set as the new starboard's reaction emoji.`)
    }
}