import { Command } from 'discord-akairo'
import { Message, TextChannel } from 'discord.js'

export default class SetBotNotice extends Command {
    public constructor() {
        super('setbotnotice', {
            aliases: ['setbotnotice', 'setbotnotices', 'setnoticechannel', 'setbotnoticechannel', 'setbotnoticeschannel'],
            category: 'Configuration',
            description: {
                content: 'miau will sometimes have notices/announcements for server owners (& staff). So you can set a private channel to receive these notices on.',
                usage: 'setbotnotice [channel]',
                examples: ['setbotnotice #staffannouncements'],
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

    public async exec(message: Message, {channel}: {channel: TextChannel}): Promise<Message> {
        if (!channel) {
            await this.client.settings.delete(message.guild, 'server-notices')
            return message.util!.send('I have successfully removed the server\'s current bot notices channel if any.')
        }

        this.client.settings.set(message.guild, 'server-notices', channel.id)
        return message.util!.send(`I have now set ${channel} as the channel for bot notices.`)
    }
}