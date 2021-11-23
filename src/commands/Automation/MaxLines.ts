import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

export default class MaxLines extends Command {
    public constructor() {
        super('maxlines', {
            aliases: ['maxlines', 'setmaxlines'],
            category: 'Automation',
            description: {
                content: 'Sets the maximum amount of lines a message can have before a user is warned. 0 will disable maxlines.',
                usage: 'maxlines [number]',
                examples: ['maxlines 9'],
            },
            channel: 'guild',
            userPermissions: ['MANAGE_GUILD'],
            ratelimit: 3,
            args: [
                {
                    id: 'lines',
                    type: (_: Message, str: string): number => {
                        if (str) if (Number(str)) return Number(str)
                        return null
                    }
                }
            ]
        })
    }

    //@ts-ignore
    userPermissions(message: Message) {
        const modRole = this.client.settings.get(message.guild, 'modRole', '')
        const hasStaffRole = message.member.permissions.has('MANAGE_GUILD', true) || message.member.roles.cache.has(modRole)

        if (!hasStaffRole) return 'Moderator'
        return null
    }

    public exec(message: Message, {lines}: {lines: number}): Promise<Message> {
        if (lines === null || lines === undefined || isNaN(lines)) return message.util.send('You need to provide an amount of lines to set as the maximum.')
        if (lines < 0 || lines > 30) return message.util.send('Don\'t you think that\'s a bit inappropriate?')

        if (lines !== 0) {
            this.client.settings.set(message.guild.id, 'auto-mod.maxLines', lines)
            return message.util.send('New max lines cap has been set successfully.')
        }
        else {
            this.client.settings.delete(message.guild.id, 'auto-mod.maxLines')
            return message.util.send('Max lines automoderation for this server has been removed.')
        }
    }
}