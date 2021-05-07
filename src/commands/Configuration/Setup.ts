import { Command } from 'discord-akairo'
import { MessageEmbed, TextChannel } from 'discord.js'
import { Message, CategoryChannel, Role, Guild } from 'discord.js'

import { Colours } from '../../utils/Colours'

export default class Setup extends Command {
    public constructor () {
        super('setup', {
            aliases: ['setup'],
            category: 'Configuration',
            description: [
                {
                    content: 'Setups modmail for your server',
                    usage: 'setup',
                    examples: ['setup']
                }
            ],
            channel: 'guild',
            userPermissions: ['MANAGE_GUILD'],
            clientPermissions: ['MANAGE_GUILD', 'MANAGE_ROLES', 'MANAGE_CHANNELS'],
            ratelimit: 3
        })
    }

    private async createSupportRole(guild: Guild): Promise<Role> {
        return await guild.roles.create({
            'data': {
                'name': 'Support',
                'hoist': true,
                'color': Colours.Pinky,
                'mentionable': false
            }})
    }

    private async createModmailCategory(guild: Guild): Promise<CategoryChannel> {
        return await guild.channels.create('Modmail', {
            'type': 'category', 
            'position': guild.channels.cache.filter(c => c.type === 'category').size
        })

    }

    private async createModmailChannel(guild: Guild, modmailCategory: CategoryChannel): Promise<TextChannel> {
        return await guild.channels.create('modmail-logs', {
            'type': 'text',
            'topic': 'Modmail logs',
            'parent': modmailCategory
        })
    }

    public async exec(message: Message): Promise<Message> {
        const serverSetup = this.client.settings.get(message.guild, 'modmail.modmail-hasSetup', false)

        if (!serverSetup) {
            message.util!.send('Please wait as this is a first time setup...')

            const supportRole = await this.createSupportRole(message.guild)
            const modmailCategory = await this.createModmailCategory(message.guild)
            const modmailChannel = await this.createModmailChannel(message.guild, modmailCategory)
                .then(tc => {
                    tc.updateOverwrite(message.guild.roles.everyone, {'VIEW_CHANNEL': false, 'SEND_MESSAGES': false})
                    tc.updateOverwrite(supportRole, {'VIEW_CHANNEL': true})
                    return tc
                }) //Sets permissions for the channel

            modmailChannel.send(new MessageEmbed()
                .setAuthor('Modmail Setup Complete', message.guild.icon)
                .setDescription(`This is the modmail logs channel. Logs of completed threads will be stored here.\n
                Anyone who can see this channel is able to use modmail commands.`)
            )

            this.client.settings.setArr(message.guild, [
                {'key': 'modmail.support-role', 'value': supportRole.id},
                {'key': 'modmail.modmail-channel', 'value': modmailChannel.id},
                {'key': 'modmail.modmail-category', 'value': modmailCategory.id},
                {'key': 'modmail.modmail-hasSetup', 'value': true}
            ])


            return message.util!.send('Modmail has now been setup for this server.')
                .then(m => {
                    message.util!.message.delete()
                    setTimeout(() => {
                        m.delete()
                    }, 5000)
                    return m
                })

            
        } else {
            const modmailArr: string[] = this.client.settings.getArr(message.guild, [
                {'key': 'modmail.support-role', 'defaultValue': ''}, //modmailArr[0]
                {'key': 'modmail.modmail-category', 'defaultValue': ''}, //modmailArr[1]
                {'key': 'modmail.modmail-channel', 'defaultValue': ''} //modmailArr[2]
            ])

            //Pardon this messy code v
            if (!message.guild.roles.resolve(modmailArr[0])) {
                const newSupportRole: Role = await this.createSupportRole(message.guild)
                this.client.settings.set(message.guild, 'modmail.support-role', newSupportRole.id)
            }
            if (!message.guild.channels.resolve(modmailArr[1])) {
                const newModmailCategory: CategoryChannel = await this.createModmailCategory(message.guild)
                this.client.settings.set(message.guild, 'modmail.modmail-category', newModmailCategory.id)
            }
            if (!message.guild.channels.resolve(modmailArr[2])) {
                const currentCategory: CategoryChannel = message.guild.channels.resolve(this.client.settings.get(message.guild, 'modmail.modmail-category', '')) as CategoryChannel
                const newTextChannel: TextChannel = await this.createModmailChannel(message.guild, currentCategory)
                this.client.settings.set(message.guild, 'modmail.modmail-channel', newTextChannel.id)
            }
            //Pardon this messy code ^

            return message.util!.send('Server modmail configuration has been updated!')
            .then(m => {
                message.util!.message.delete()
                setTimeout(() => {
                    m.delete()
                }, 4500)
                return m
            })
            
            
        }
    }
}