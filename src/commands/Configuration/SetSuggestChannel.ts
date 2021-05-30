import { Argument, Command } from 'discord-akairo'
import { Message, TextChannel } from 'discord.js'

export default class SetSuggestChannel extends Command {
    public constructor() {
        super('setsuggestchannel', {
            aliases: ['setsuggestchannel', 'suggestchannel'],
            category: 'Configuration',
            description: {
                content: 'Sets a channel for suggestions to be posted to.',
                usage: 'setsuggestchannel [channel]',
                examples: ['setsuggestchannel #ch'],
            },
            channel: 'guild',
            ratelimit: 3,
            args: [
                {
                    id: 'channel',
                    type: Argument.union('textChannel')
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

    public exec(message: Message, {channel}: {channel: TextChannel}): Promise<Message> {
        if (!channel) return message.util!.send('Please provide a valid channel to use for suggestions.')
        
        this.client.settings.set(message.guild, 'suggest-channel', channel.id)
        return message.util!.send(`I have now set the new suggestion channel to ${channel.name} (${channel.id})`)
    }
}