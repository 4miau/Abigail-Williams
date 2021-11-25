import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

export default class Unsetup extends Command {
    public constructor() {
        super('unsetup', {
            aliases: ['unsetup'],
            category: 'Configuration',
            description: {
                content: 'Removes all of my setup modifications made.',
                usage: 'unsetup',
                examples: ['unsetup'],
            },
            channel: 'guild',
            ratelimit: 3
        })
    }

    //@ts-ignore
    userPermissions(message: Message) {
        const modRole = this.client.settings.get(message.guild, 'modRole', '')
        const hasStaffRole = message.member.permissions.has('MANAGE_GUILD', true) || message.member.roles.cache.has(modRole)

        if (!hasStaffRole) return 'Moderator'
        return null
    }

    public async exec(message: Message): Promise<Message> {
        message.channel.send('Are you sure that you would like me to unsetup everything I had setup? (y, ye, yea, yes to confirm)')

        const filter = (msg: Message) => msg.author.id === message.author.id
        const reply = (await message.channel.awaitMessages({ filter: filter, max: 1, time: 30000 })).first().content

        if (reply && (/^y(?:e(?:a|s)?)?$/i).test(reply)) {
            const hasPremium = this.client.settings.get(message.guild, 'has-premium', false)
            this.client.settings.clear(message.guild)
            this.client.settings.set(message.guild, 'has-premium', hasPremium)
            return message.channel.send('I have cleared all things setup in the server.')
        }
        else return message.channel.send('You did not confirm the operation so it will be cancelled now.')
    }
}