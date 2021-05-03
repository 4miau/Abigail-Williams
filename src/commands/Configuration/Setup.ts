import { Command } from 'discord-akairo'
import { MessageEmbed, TextChannel } from 'discord.js'
import { Message, CategoryChannel, Role } from 'discord.js'
import { Repository } from 'typeorm'

import { ModmailSetup } from '../../models/ModmailSetup'

export default class Setup extends Command {
    public constructor () {
        super('setup', {
            aliases: ['setup'],
            category: 'Configuration',
            description: [
                {
                    content: 'Setups modmail for your server',
                    usage: ['setup'],
                    examples: ['setup']
                }
            ],
            userPermissions: ['MANAGE_GUILD'],
            clientPermissions: ['MANAGE_GUILD', 'MANAGE_ROLES', 'MANAGE_CHANNELS'],
            ratelimit: 3
        })
    }

    public async exec(message: Message): Promise<Message> {
        const setupRepo: Repository<ModmailSetup> = this.client.db.getRepository(ModmailSetup)
        const serverSetup = await setupRepo.find().then(msArr => msArr.find(ms => ms.guild === message.guild.id))

        if (!serverSetup) {
            message.util!.send('Please wait as this is a first time setup...')
            
            const supportRole: Role = await message.guild.roles.create({
                'data': {
                    'name': 'Support',
                    'hoist': true,
                    'color': '#ea8cff',
                    'mentionable': false
                }})
            
            const modmailCategory: CategoryChannel = await message.guild.channels.create('Modmail', {
                'type': 'category', 
                'position': message.guild.channels.cache.filter(c => c.type === 'category').size
            })
            
            const modmailChannel: TextChannel = await message.guild.channels.create('logs', {
                'type': 'text',
                'topic': 'Modmail logs',
                'parent': modmailCategory
            }).then(tc => {
                tc.updateOverwrite(message.guild.roles.everyone, {'VIEW_CHANNEL': false, 'SEND_MESSAGES': false})
                tc.updateOverwrite(supportRole, {'VIEW_CHANNEL': true})
                return tc
            })

            modmailChannel.send(new MessageEmbed()
                .setAuthor('Modmail Setup Complete', message.guild.icon)
                .setDescription(`This is the modmail logs channel. Logs of completed threads will be stored here.\n
                Anyone who can see this channel is able to use modmail commands.`)
            )

            await setupRepo.insert({
                'guild': message.guild.id,
                'category': modmailCategory.id,
                'modrole': supportRole.id,
                'modchannel': modmailChannel.id
            })

            return message.util!.send('Modmail has now been setup for this server.')
        } else {
            return message.util!.send('This server already has been set up.')
            //TEMPORARY
        }


    }
}

/*
1 => 
*/