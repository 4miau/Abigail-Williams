import { Command } from 'discord-akairo'
import { Message, Role } from 'discord.js'

export default class RemoveStreamerPing extends Command {
    public constructor() {
        super('removestreamerping', {
            aliases: ['removestreamerping', 'removestreampings', 'removestreamping', 'deletestreamping'],
            category: 'Twitch',
            description: {
                content: 'Removes a role ping for streamers on the watchlist.',
                usage: 'removestreamping [streamer] [role]',
                examples: ['removestreamping notmiauu everyone', 'removestreamping notmiauu @role'],
            },
            ratelimit: 3,
            args: [
                {
                    id: 'streamerName',
                    type: 'string',
                    match: 'phrase'
                },
                {
                    id: 'role',
                    type: 'role',
                    match: 'rest'
                }
            ]
        })
    }

    //@ts-ignore
    userPermissions(message: Message) {
        const modRole = this.client.settings.get(message.guild, 'modRole', '')
        const hasStaffRole = message.member.permissions.has('ADMINISTRATOR', true) || message.member.roles.cache.has(modRole)

        if (!hasStaffRole) return 'Server administrator or staff role'
        return null
    }

    public async exec(message: Message, {streamerName, role}: {streamerName: string, role: Role}): Promise<Message> {
        if (!streamerName) return message.channel.send('Please provide a streamer to add a ping for.')
        if (!role) return message.channel.send('Ehm... you need a valid role to provide as a ping.')

        const streamers : {
            name: string, 
            message: string, 
            pings: string[], 
            posted: boolean
        }[] = this.client.settings.get(message.guild, 'twitch.twitch-streamers', {})
        
        if (streamers.arrayEmpty()) return message.channel.send('You need to add streamers on the watchlist before you can remove them.')

        if (streamerName === 'all') {
            this.client.settings.set(message.guild, 'twitch.twitch-streamers', streamers.map(s => {
                if (!s.pings.includes(role.toString())) return
                s.pings = s.pings.filter(p => p !== role.toString())
                return s
            }))

            return message.channel.send('Role has been removed from all streamer\'s role pings that contain this role.')
        }

        let streamer = streamers.findIndex(s => s.name === streamerName)

        if (streamer === -1) return message.channel.send('This member is not on the streamer list.')

        if (streamers[streamer].pings.includes(role.toString())) {
            streamers[streamer].pings = streamers[streamer].pings.filter(p => p !== role.toString())
            this.client.settings.set(message.guild, 'twitch.twitch-streamers', streamers)

            return message.channel.send('Role has been removed from the streamer\'s role pings')
        } else return message.channel.send('That role isn\'t one of the role mentions')
    }
}