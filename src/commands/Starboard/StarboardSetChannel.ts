import { Command } from 'discord-akairo'
import { Message, TextChannel } from 'discord.js'

export default class StarboardSetChannel extends Command {
    public constructor() {
        super('starboardsetchannel', {
            aliases: ['starboardsetchannel', 'starboardchannel', 'sbsetchannel', 'sbchannel', 'sbsetup', 'starboardsetup'],
            category: 'Starboard',
            description: {
                content: 'Setup a channel for starboards to be posted in.',
                usage: 'starboardsetup [channel]',
                examples: ['starboardsetup #starboard'],
            },
            ownerOnly: true,
            channel: 'guild',
            ratelimit: 3,
            args: [
                {
                    id: 'channel',
                    type: 'textChannel',
                    match: 'rest',
                    prompt: {
                        start: (msg: Message) => `${msg.author}, provide a channel to set up starboard.`,
                        retry: (msg: Message) => `${msg.author}, provide a valid channel to set up starboard in.`,
                        cancel: () => `Command has now been cancelled.`
                    }
                }
            ]
        })
    }

    //@ts-ignore
    userPermissions(message: Message) {
        const modRole: string = this.client.settings.get(message.guild, 'modRole', '')
        const hasStaffRole = message.member.hasPermission('MANAGE_GUILD', { checkAdmin: true, checkOwner: true}) || message.member.roles.cache.has(modRole)

        if (!hasStaffRole) return 'Moderator or MANAGE_GUILD missing.'
        return null
    }

    public exec(message: Message, {channel}: {channel: TextChannel}): Promise<Message> {
        this.client.settings.set(message.guild, 'starboard.starboardChannelID', channel.id)
        return message.util!.send('New starboard channel has been set successfully.')
    }
}