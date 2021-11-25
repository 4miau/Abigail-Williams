import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

export default class ReportBlacklist extends Command {
    public constructor() {
        super('reportblacklist', {
            aliases: ['reportblacklist'],
            category: 'Developer',
            description: {
                content: 'Blacklists/Whitelists a user from using the report command.',
                usage: 'reportblacklist [\'add\'/\'remove\'] [user]',
                examples: ['reportblacklist add miau', 'reportblacklist remove miau'],
            },
            ownerOnly: true,
            channel: 'guild',
            ratelimit: 3,
            args: [
                {
                    id: 'type',
                    type: (_: Message, str: string) => {
                        return (str.toLowerCase() === 'add' || str.toLowerCase() === 'remove') ? str : null
                    }
                }
            ]
        })
    }

    public exec(message: Message): Promise<Message> {
        return message.util.send('hi')
    }
}
//TODO: Create this command