import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

export default class Massban extends Command {
    public constructor() {
        super('massban', {
            aliases: ['massban'],
            category: 'Moderation',
            description: {
                content: 'Bans multiple members from the server, separated by a space.',
                usage: 'massban [user1] <user2> <user3> ...',
                examples: ['massban user1 user2 user3'],
            },
            ratelimit: 3,
            args: [
                {
                    id: 'members',
                    type: (_: Message, str: string) => {
                        if (!str) return null
                        return str.trim()
                    },
                    match: 'rest',
                    
                }
            ]
        })
    }

    //@ts-ignore
    userPermissions(message: Message) {
        const modRole = this.client.settings.get(message.guild, 'modRole', '')
        const hasStaffRole = message.member.permissions.has('BAN_MEMBERS', true) || message.member.roles.cache.has(modRole)

        if (!hasStaffRole) return 'Moderator'
        return null
    }

    public async exec(message: Message, {members}: {members: string}): Promise<Message> {
        if (!members) return message.util.send('Okay, so who on earth am I supposed to ban then?')

        const memberArr: string[] = members.split(' ').map(m => {
            if (m.startsWith('<@!')) return m.replaceAll('<@!', '').replaceAll('>', '')
            return m
        })

        for (const member of memberArr) {
            const gm = message.guild.members.resolve(member)

            try {
                await gm.ban({ days: 7, reason: 'Massban' })
                await message.channel.send(`Successfully banned ${gm}`).then(msg => setTimeout(() => { msg.delete() }, 4000))
            } catch {
                await message.channel.send(`Unable to ban ${gm}`).then(msg => setTimeout(() => { msg.delete() }, 4000))
            }
        }

        return message.util.send('Attempted to ban all bannable users')
            .then(msg => {
                setTimeout(() => { msg.delete() }, 4000)
                return msg
            })
    }
}