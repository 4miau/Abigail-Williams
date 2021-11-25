import { Argument, Command } from 'discord-akairo'
import { GuildMember, Message, MessageEmbed, User } from 'discord.js'

import { Colours } from '../../util/Colours'

export default class Premium extends Command {
    public constructor() {
        super('premium', {
            aliases: ['premium', 'setpremiumuser'],
            category: 'Developer',
            description: {
                content: 'Manually provides/removes a user with premium. Will require up to 5 minutes to register a server as a premium server.',
                usage: 'premium [\'add\'/\'remove\'] [user]',
                examples: ['premium add miau'],
            },
            ownerOnly: true,
            channel: 'guild',
            ratelimit: 3
        })
    }

    *args(): any {
        const type = yield {
            index: 0,
            type: (_: Message, str: string) => { 
                return (str.toLowerCase() === 'add' || str.toLowerCase() === 'remove' || str.toLowerCase() === 'list') ? str.toLowerCase() : null
            },
            match: 'phrase',
            default: null
        }

        const user = yield {
            index: 1,
            type: Argument.union('member', 'string'),
            match: 'rest'
        }

        if (type && user) return { type, user }
        else return { type }
    }

    public exec(message: Message, {type, user}: {type: string, user: string | User}): Promise<Message> {
        if (!type) return message.channel.send('You did not provide a valid type, try again properly.')
        if (!user && type !== 'list') return message.channel.send('You did not provide a valid user, try again properly.')
        if (typeof user === 'string') {
            user = this.client.users.resolve(user)
            if (!user) return message.channel.send('Unable to resolve this user.')
        } 
        if (user && user.bot) return message.channel.send('You can not manage premium subscription of bots.')

        const premiumUsers: string[] = this.client.settings.get('global', 'premium-users', [])

        if (type === 'add') {
            if (premiumUsers.includes(user.id)) return message.channel.send('This user already has premium.')
            premiumUsers.push(user.id)
            this.client.settings.set('global', 'premium-users', premiumUsers)
            return message.channel.send('User has been given premium.')
        }
        else if (type === 'remove') {
            if (!premiumUsers.includes(user.id)) return message.channel.send('This user does not have premium.')
            this.client.settings.set('global', 'premium-users', premiumUsers.filter(id => id !== (user as User).id))
            return message.channel.send('User has been stripped off of premium.')
        }
        else {
            if (premiumUsers.arrayEmpty()) return message.channel.send('There are currently no premium users')

            const premiumList: User[] = []

            premiumUsers.forEach(async pu => {
                const user = this.client.users.resolve(pu)
                premiumList.push(user)
            })

            const e = new MessageEmbed()
                .setAuthor('Premium Users')
                .setDescription(premiumList.map(u => `${u.username}`).join('\n'))
                .setColor(Colours.Tomato)
                .setFooter('Powered by the cutie miau.')

            return message.channel.send({ embeds: [e] })
        }
    }
}