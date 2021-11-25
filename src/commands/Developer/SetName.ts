import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

export default class SetName extends Command {
    public constructor() {
        super('setname', {
            aliases: ['setname', 'setusername'],
            category: 'Developer',
            description: {
                content: 'Sets the new username for me.',
                usage: 'setuser [name]',
                examples: ['setuser abigail'],
            },
            channel: 'guild',
            ratelimit: 3,
            args: [
                {
                    id: 'name',
                    type: 'string',
                    match: 'rest'
                }
            ]
        })
    }

    public async exec(message: Message, {name}: {name: string}): Promise<Message> {
        if (!name) {
            await this.client.user.setUsername('Abigail Williams')
            return message.util.send('Reset the name to the default name.')
        }

        if (name.length < 4) return message.util.send('My new username must be 4 characters or longer to be set.')

        this.client.user.setUsername(name)
        return message.util!.send(`My username has now been set to ${name}`)
    }
}