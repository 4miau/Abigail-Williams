import { Command } from 'discord-akairo'
import { GuildChannel, Message, TextChannel } from 'discord.js'

export default class SetBotNotice extends Command {
    public constructor() {
        super('setbotnotice', {
            aliases: ['setbotnotice', 'setbotnotices', 'setnoticechannel', 'setbotnoticechannel', 'setbotnoticeschannel'],
            category: 'Configuration',
            description: {
                content: 'miau will sometimes have notices/announcements for server owners (& staff). So you can set a private channel to receive these notices on.',
                usage: 'setbotnotice [channel]',
                examples: ['setbotnotice #staffannouncements'],
            },
            channel: 'guild',
            ratelimit: 3,
            args: [
                {
                    id: 'channel',
                    type: 'channel'
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

    public async exec(message: Message, {channel}: {channel: GuildChannel}): Promise<Message> {
        if (!channel) {
            await this.client.settings.delete(message.guild, 'server-notices')
            return message.channel.send('I have successfully removed the server\'s current bot notices channel if any.')
        }

        if (channel.type === 'GUILD_NEWS' || channel.type === 'GUILD_TEXT') {
            this.client.settings.set(message.guild, 'server-notices', channel.id)
            return message.channel.send(`I have now set ${channel} as the channel for bot notices.`)
        }

        return message.channel.send('You need to provide a text channel to set as the new bot notices channel.')
    }
}