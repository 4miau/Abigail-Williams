import { Command } from 'discord-akairo'
import { Message, Role } from 'discord.js'

export default class AddStreamerPing extends Command {
    public constructor() {
        super('addstreamerping', {
            aliases: ['addstreamerping', 'addstreampings', 'addstreamping'],
            category: 'Twitch',
            description: {
                content: 'Add a role ping for streamers on the watchlist.',
                usage: 'addstreamping [streamerName] [role]',
                examples: ['addstreamping 4miau everyone'],
            },
            channel: 'guild',
            ratelimit: 3,
            args: [
                {
                    id: 'streamer',
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

    public async exec(message: Message, {streamer, role}: {streamer: string, role: Role}): Promise<Message> {
        if (!streamer) return message.channel.send('Please provide a streamer to add a ping for.')
        if (!role) return message.channel.send('Ehm... you need a valid role to provide as a ping.')

        const streamers: Streamer[] = this.client.settings.get(message.guild, 'streamers', [])

        if (streamers.arrayEmpty()) return message.channel.send('You need to add streamers onto the watchlist to assign role pings.')

        if (streamer === 'all') {
            this.client.settings.set(message.guild, 'streamers', streamers.map(s => {
                if (s.pings.includes(role.toString())) return
                s.pings.push(role.toString())
                return s
            }))

            return message.channel.send('Role has been successfully added to the mention list of all streamers it is not currently added for already.')
        }

        const pingsIndex = streamers.findIndex(s => s.name === streamer)

        if (pingsIndex === -1) return message.channel.send('This streamer is not on the watchlist.')

        if (streamers[pingsIndex].pings.includes(role.toString())) return message.channel.send('This role is already on the mentions list.')
        else {
            role !== message.guild.roles.everyone ? streamers[pingsIndex].pings.push(role.toString()) : streamers[pingsIndex].pings.push('@everyone')
            this.client.settings.set(message.guild, 'streamers', streamers)
            return message.channel.send('Role has been successfully added to the mention list of this streamer!')
        }
    }
}