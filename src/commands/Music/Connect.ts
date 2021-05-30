import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

export default class Connect extends Command {
    public constructor() {
        super('connect', {
            aliases: ['connect', 'join'],
            category: 'Music',
            description: {
                content: 'Will connect to the vc if not in one already.',
                usage: 'connect',
                examples: ['connect'],
            },
            channel: 'guild',
            ratelimit: 3,
        })
    }

    //@ts-ignore
    userPermissions(message: Message) {
        const djRole: string = this.client.settings.get(message.guild, 'djRole', '')

        if (!djRole) return null

        const hasDJRole = message.member.roles.cache.has(djRole)

        if (!hasDJRole) return 'DJ Role'
        return null
    }

    public exec(message: Message): Promise<Message> {
        const usersVC = message.member.voice.channel
        if (!usersVC) return message.util!.send('You must be in a VC for me to connect.')

        if (this.client.manager.players.size)
            if (this.client.manager.players.first().voiceChannel === usersVC.id) 
                return message.util!.send('I\'m already in that VC silly.')

        this.client.manager.create({
            'guild': message.guild.id,
            'voiceChannel': usersVC.id,
            'textChannel': message.channel.id,
            'node': 'root',
            'selfDeafen': true,
            'volume': 100,
        })
        .connect()

        return message.util!.send(`I have successfully connected to the voice channel.`)
    }
}