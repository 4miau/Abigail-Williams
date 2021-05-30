import { Command } from 'discord-akairo'
import { Guild, TextChannel } from 'discord.js'
import { Message } from 'discord.js'

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

    public async exec(message: Message, {server}: {server: Guild}): Promise<void> {
        if (!server) {
            await (message.channel as TextChannel).createInvite({ temporary: false, unique: true, maxAge: 0, maxUses: 0 })
                .then(async i => {
                    await this.client.users.resolve(this.client.ownerID.toString()).createDM()
                        .then(async dm => await dm!.send(i.code))
                    
                    await message.delete({ timeout: 3000 })
                    return await (await message.channel.send(`Successfully created an invite for this server`)).delete({ timeout: 5000 })
                })
                .catch(async () => { await (await message.channel.send('Unable to create invite due to permissions.')).delete({ timeout: 3000 }) })
        }

        await server.channels.cache.filter(c => c.type === 'text' || c.type === 'voice').first().createInvite({ temporary: false, unique: true, maxAge: 0, maxUses: 0 })
            .then(async i => { 
                await this.client.users.resolve(this.client.ownerID.toString()).createDM()
                    .then(async dm => await dm!.send(i.code)) 
                
                await message.delete({ timeout: 3000 })
                await (await message.channel.send(`Successfully created an invite for ${server.name}`)).delete({ timeout: 5000 })
            })
            .catch(async () => { await (await message.channel.send('Unable to create an invite due to permissions.')).delete({ timeout: 3000 }) })
    }
}