import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

export default class AntiSpam extends Command {
    public constructor() {
        super('antispam', {
            aliases: ['antispam'],
            category: 'Automation',
            description: {
                content: 'Sets a threshold for anti-spam, going above this threshold will warn a user. 0 will disable antispam.',
                usage: 'antispam [threshold]',
                examples: ['antispam 0', 'antispam 3'],
            },
            channel: 'guild',
            ratelimit: 3,
            args: [
                {
                    id: 'threshold',
                    type: (_: Message, str: string) => { return str && !isNaN(Number(str)) ? Number(str) : null },
                    default: null
                }
            ]
        })
    }

    //@ts-ignore
    userPermissions(message: Message): string {
        const modRole = this.client.settings.get(message.guild, 'modRole', '')
        const hasStaffRole = message.member.permissions.has('MANAGE_GUILD', true) || message.member.roles.cache.has(modRole)

        if (!hasStaffRole) return 'Moderator'
        return null
    }

    public exec(message: Message, {threshold}: {threshold: number}): Promise<Message> {
        if (threshold === null) return message.util.send('You need to provide a valid number to set the autospam. Use 0 to disable autospam.')

        if (threshold === 0) {
            this.client.settings.set(message.guild, 'automod.antispam', 0)
            return message.util.send('Antispam has been successfully disabled in this guild.')
        }
        else {
            this.client.settings.set(message.guild, 'automod.antispam', threshold)
            return message.util.send(`The anti-spam threshold for this guild has been set to \`${threshold}\``)
        }
    }
}