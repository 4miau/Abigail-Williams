import { Command } from 'discord-akairo'
import { Message, TextChannel } from 'discord.js'

export default class SetModmailChannel extends Command {
    public constructor() {
        super('setmodmailchannel', {
            aliases: ['setmodmailchannel'],
            category: 'Configuration',
            description: {
                content: 'Sets the modmail channel (+category)',
                usage: 'setmodmailchannel #channel',
                examples: ['setmodmailchannel #modmail-logs'],
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
        const hasStaffRole = message.member.permissions.has(['MANAGE_CHANNELS', 'MANAGE_GUILD'], true) || message.member.roles.cache.has(modRole)

        if (!hasStaffRole) return 'Moderator'
        return null
    }

    public async exec(message: Message, {channel}: {channel: TextChannel}): Promise<Message> {
        if (!channel) return message.channel.send('You must provide a valid channel to set modmail-logs in. (needs to be in a category or one will be made)')

        this.client.settings.set(message.guild, 'modmail-channel', channel.id)

        if (channel.parent.type !== 'GUILD_CATEGORY') {
            await message.guild.channels.create('Modmail logs', { type: 'GUILD_CATEGORY', topic: 'Modmail logs' })
                .then(cat => {
                    channel.setParent(cat, {'lockPermissions': true})
                    this.client.settings.set(message.guild, 'modmail-category', cat.id)
                    message.channel.send('New category and modmail')
                })
                .catch(() => message.channel.send('I do not have valid permissions to be able to be able to create the new category/channel.'))
        }
        else return message.channel.send('New modmail channel has been created successfully.')
    }
}