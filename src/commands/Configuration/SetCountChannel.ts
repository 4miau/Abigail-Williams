import { Command } from 'discord-akairo'
import { Message, TextChannel } from 'discord.js'

export default class SetCountChannel extends Command {
    public constructor() {
        super('setcountchannel', {
            aliases: ['setcountchannel', 'setcount'],
            category: 'Configuration',
            description: {
                content: 'Set the channel for counting. (Leave blank to remove)',
                usage: 'setcount <channel>',
                examples: ['setcount #counting'],
            },
            channel: 'guild',
            ratelimit: 3,
            args: [
                {
                    id: 'channel',
                    type: 'textChannel'
                }
            ]
        })
    }

    //@ts-ignore
    userPermissions(message: Message) {
        const modRole = this.client.settings.get(message.guild, 'modRole', '')
        const hasStaffRole = message.member.permissions.has('MANAGE_CHANNELS', true) || message.member.roles.cache.has(modRole)

        if (!hasStaffRole) return 'Moderator or Manage Channels permission missing.'
        return null
    }

    public async exec(message: Message, {channel}: {channel: TextChannel}): Promise<Message> {
        if (!channel) {
            this.client.settings.delete(message.guild, 'count')
            return message.channel.send('I have removed the server\'s current count channel, if any was set.')
        }

        this.client.settings.set(message.guild, 'count.count-channel', channel.id)
        await channel.send('I will now keep track of counting in this channel!').then(m => m.pin())
        return message.channel.send(`New count channel has been set to ${channel}`)
    }
}