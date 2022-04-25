import { Command } from 'discord-akairo'
import { Message, TextChannel } from 'discord.js'

export default class ResetCount extends Command {
    public constructor() {
        super('resetcount', {
            aliases: ['resetcount', 'resetcounter'],
            category: 'Configuration',
            description: {
                content: 'Resets the current counter of the guild.',
                usage: 'resetcount',
                examples: ['resetcount'],
            },
            channel: 'guild',
            ratelimit: 3
        })
    }

    //@ts-ignore
    userPermissions(message: Message) {
        const modRole = this.client.settings.get(message.guild, 'modRole', '')
        const hasStaffRole = message.member.permissions.has('MANAGE_GUILD', true) || message.member.roles.cache.has(modRole)

        if (!hasStaffRole) return 'Moderator'
        return null
    }

    public async exec(message: Message): Promise<Message> {
        const countChannel = message.guild.channels.resolve(this.client.settings.get(message.guild, 'count-channel', ''))

        const prefix = this.client.settings.get(message.guild, 'prefix', 'a.')
        if (!countChannel) return message.channel.send(`You do not have counting set up on this server, set a channel with ${prefix}setchannel first.`)

        this.client.settings.setArr(message.guild, [
            { key: 'current-count', value: 0 },
            { key: 'count-sender', value: '' },
            { key: 'reset-count', value: true }
        ])

        await (countChannel as TextChannel).send('The counter has been reset to 0 via command, please start over from 1.')
        return message.channel.send('Counter has been reset successfully')
    }
}