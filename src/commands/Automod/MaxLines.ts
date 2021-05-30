import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

export default class MaxLines extends Command {
    public constructor() {
        super('maxlines', {
            aliases: ['maxlines', 'setmaxlines'],
            category: 'Automod',
            description: {
                content: 'Sets the maximum amount of lines a message can have before a user is warned.',
                usage: 'maxlines [number]',
                examples: ['maxlines 9'],
            },
            channel: 'guild',
            userPermissions: ['MANAGE_GUILD'],
            ratelimit: 3,
            args: [
                {
                    id: 'lines',
                    type: 'number'
                }
            ]
        })
    }

    //@ts-ignore
    userPermissions(message: Message) {
        const modRole: string = this.client.settings.get(message.guild, 'modRole', '')
        const hasStaffRole = message.member.hasPermission('MANAGE_GUILD', { checkAdmin: true, checkOwner: true}) || message.member.roles.cache.has(modRole)

        if (!hasStaffRole) return 'Moderator'
        return null
    }

    public exec(message: Message, {lines}: {lines: number}): Promise<Message> {
        if (lines === null || lines === undefined) return message.util!.send('You need to provide an amount of lines to set as the maximum.')
        if (lines < 0 || lines > 30) return message.util!.send('Don\'t you think that\'s a bit inappropriate?')

        ;(lines !== 0 ?
        () => {
            this.client.settings.set(message.guild, 'auto-mod.maxLines', lines)
            return message.util!.send('New max lines cap has been set successfully.')
        } : () => {
            this.client.settings.delete(message.guild, 'auto-mod.maxLines')
            return message.util!.send('Max lines automoderation for this server has been removed.')
        })()
    }
}