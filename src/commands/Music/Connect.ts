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
            ratelimit: 3,
        })
    }

    public exec(message: Message): Promise<Message> {
        const usersVC = message.member.voice.channel
        if (!usersVC) return message.util!.send('You must be in a VC for me to connect.')

        if (this.client.manager.players.size)
            if (this.client.manager.players.first().voiceChannel === usersVC.id) 
                return message.util!.send('I\'m already in that VC silly.')

        const player = this.client.manager.create({
            'guild': message.guild.id,
            'voiceChannel': usersVC.id,
            'textChannel': message.channel.id,
            'node': 'root',
            'volume': 100
        })

        player.connect()

        return message.util!.send(`I have successfully connected to the voice channel.`)
    }
}