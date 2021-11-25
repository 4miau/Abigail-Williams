import { Command } from 'discord-akairo'
import { Message, TextChannel } from 'discord.js'

export default class JoinLeaveChannel extends Command {
    public constructor() {
        super('joinleavechannel', {
            aliases: ['joinleavechannel', 'welcomechannel', 'setwelcomechannel'],
            category: 'Configuration',
            description: {
                content: 'Sets the channel join and leave messages are sent in. Or returns the current server\'s if no channel is inputted.',
                usage: 'setwelcomechannel <channel>',
                examples: ['setwelcomechannel #welcome', 'welcomechannel'],
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
        const hasStaffRole = message.member.permissions.has('MANAGE_GUILD', true) || message.member.roles.cache.has(modRole)

        if (!hasStaffRole) return 'Moderator'
        return null
    }

    public exec(message: Message, {channel}: {channel: TextChannel}): Promise<Message> {
        if (!channel) {
            const currChannel = this.client.settings.get(message.guild, 'join-leave.channel', '')
            return currChannel ? message.channel.send(`<#${currChannel}>`) : message.channel.send('This server current does not have a channel for join-leaves.')
        }

        this.client.settings.set(message.guild, 'join-leave.channel', channel.id)
        
        return message.channel.send('New text channel for join-leave messages has been set.')
    }
}