import { Argument, Command } from 'discord-akairo'
import { Guild } from 'discord.js'
import { GuildChannel, Message } from 'discord.js'

export default class CreateInvite extends Command {
    public constructor() {
        super('createinvite', {
            aliases: ['createinvite'],
            category: 'Owner',
            description: {
                content: 'Creates an invite to a server I am in.',
                usage: 'createinvite [guild]',
                examples: ['createinvite Bunny Cartel'],
            },
            ratelimit: 3,
            args: [
                {
                    id: 'server',
                    type: 'guild',
                    match: 'rest'
                }
            ]
        })
    }

    public async exec(message: Message, {server}: {server: Guild}): Promise<Message> {
        if (!server) return message.util!.send('You should provide a server to create an invite for.')

        await server.channels.cache.filter(c => c.type === 'text' || c.type === 'voice').first().createInvite({ temporary: false, unique: true, maxAge: 0, maxUses: 0 })
            .then(async i => { 
                await this.client.users.resolve(this.client.ownerID.toString()).createDM()
                    .then(async dm => await dm!.send(i.code)) 
                
                await message.channel.send(`Successfully created an invite for ${server.name}`)
            })
            .catch(() => {
                message.channel.send('Unable to create invite, please fix this.')
                return void 0
            })
    }
}