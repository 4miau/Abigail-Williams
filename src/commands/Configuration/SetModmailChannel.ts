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
        const modRole: string = this.client.settings.get(message.guild, 'modRole', '')
        const hasStaffRole = message.member.hasPermission(['MANAGE_CHANNELS', 'MANAGE_GUILD'], { checkAdmin: true, checkOwner: true}) || message.member.roles.cache.has(modRole)

        if (!hasStaffRole) return 'Moderator'
        return null
    }

    public async exec(message: Message, {channel}: {channel: TextChannel}): Promise<Message> {
        if (!channel) return message.util!.send('You must provide a valid channel to set modmail-logs in. (needs to be in a category or one will be made)')

        this.client.settings.set(message.guild, 'modmail.modmail-channel', channel.id)

        if (channel.parent.type !== 'category') {
            await message.guild.channels.create('Modmail logs', {
                'type': 'category',
                'topic': 'Modmail logs'
            })
            .then(cat => {
                channel.setParent(cat, {'lockPermissions': true})
                this.client.settings.set(message.guild, 'modmail.modmail-category', cat.id)
                message.util!.send('New category and modmail')
            })
            .catch(() => message.util!.send('I do not have valid permissions to be able to be able to create the new category/channel.'))
        }
        else return message.util!.send('New modmail channel has been created successfully.')
    }
}