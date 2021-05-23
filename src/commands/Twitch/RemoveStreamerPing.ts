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
            ownerOnly: true,
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

    public async exec(message: Message, {streamerName, role}: {streamerName: string, role: Role}): Promise<Message> {
        if (!streamerName) return message.util!.send('Please provide a streamer to add a ping for.')
        if (!role) return message.util!.send('Ehm... you need a valid role to provide as a ping.')

        let twitchUsers: { 
            name: string, 
            message: string, 
            pings: string[], 
            posted: boolean }[] = this.client.settings.get(message.guild, 'twitch.twitch-streamers', [])
        
        if (!twitchUsers || twitchUsers.length === 0) return message.util!.send('You need to add streamers on the watchlist before you can remove them.')

        let streamer = twitchUsers.findIndex(s => s.name === streamerName)

        if (streamer === -1) return message.util!.send('This member is not on the streamer list.')

        if (twitchUsers[streamer].pings.includes(role.id)) {
            twitchUsers[streamer].pings = twitchUsers[streamer].pings.filter(p => p !== role.id)
            this.client.settings.set(message.guild, 'twitch.twitch-streamer', twitchUsers)

            return message.util!.send('Role has been removed from the streamer\'s role pings')
        } else return message.util!.send('That role isn\'t one of the role mentions')
    }
}