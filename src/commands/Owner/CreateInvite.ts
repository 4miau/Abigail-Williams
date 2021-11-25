import { Command } from 'discord-akairo'
import { Guild, GuildChannel, TextChannel } from 'discord.js'
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
                        .then(dm => dm.send(i.code))
                    
                    setTimeout(() => { message.delete() }, 3000)
                    return message.channel.send('Successfully created an invite for this server')
                        .then(msg => {
                            setTimeout(() => { msg.delete() }, 5000)
                            return msg
                        })
                })
                .catch(async () => { 
                    await message.channel.send('Unable to create invite due to permissions.')
                        .then(msg => setTimeout(() => { msg.delete() }, 3000))
                })
        }

        (server.channels.cache.filter(c => !c.isThread && (c.type === 'GUILD_TEXT' || c.type === 'GUILD_VOICE')).first() as TextChannel).createInvite({ temporary: false, unique: true, maxAge: 0, maxUses: 0 })
            .then(async i => { 
                await this.client.users.resolve(this.client.ownerID.toString()).createDM()
                    .then(dm => dm.send(i.code)) 
                
                setTimeout(() => { message.delete() }, 3000)
                await message.channel.send(`Successfully created an invite for ${server.name}`)
                    .then(msg => setTimeout(() => { msg.delete() }, 5000))
            })
            .catch(async () => {
                await message.channel.send('Unable to create an invite due to permissions.')
                    .then(msg => setTimeout(() => { msg.delete() }, 3000))
            })
    }
}