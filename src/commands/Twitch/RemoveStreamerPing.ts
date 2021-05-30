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
        const hasStaffRole = message.member.hasPermission('ADMINISTRATOR', { checkAdmin: false, checkOwner: true})

        if (!hasStaffRole) return 'Server Administrator'
        return null
    }

    public async exec(message: Message, {streamerName, role}: {streamerName: string, role: Role}): Promise<Message> {
        if (!streamerName) return message.util!.send('Please provide a streamer to add a ping for.')
        if (!role) return message.util!.send('Ehm... you need a valid role to provide as a ping.')

        let twitchUsers: { 
            name: string, 
            message: string, 
            pings: string[], 
            posted: boolean }[] = this.client.settings.get(message.guild, 'twitch.twitch-streamers', [])
        
        if (!twitchUsers || twitchUsers.length === 0) return message.util!.send('You need to add streamers on the watchlist before you can remove them.')

        if (streamerName === 'all') {
            this.client.settings.set(message.guild, 'twitch.twitch-streamers', twitchUsers.map(s => {
                if (!s.pings.includes(role.id) && !s.pings.includes(role.name)) return;
                s.pings.filter(p => p !== role.id || p !== role.name)
                return s
            }))

            return message.util!.send('Role has been removed from all streamer\'s role pings that contain this role.')
        }

        let streamer = twitchUsers.findIndex(s => s.name === streamerName)

        if (streamer === -1) return message.util!.send('This member is not on the streamer list.')

        if (twitchUsers[streamer].pings.includes(role.id) || twitchUsers[streamer].pings.includes(role.name)) {
            twitchUsers[streamer].pings = twitchUsers[streamer].pings.filter(p => p !== role.id) || twitchUsers[streamer].pings.filter(p => p !== role.name)
            this.client.settings.set(message.guild, 'twitch.twitch-streamer', twitchUsers)

            return message.util!.send('Role has been removed from the streamer\'s role pings')
        } else return message.util!.send('That role isn\'t one of the role mentions')
    }
}