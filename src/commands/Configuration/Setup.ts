import { Command } from 'discord-akairo'
import { Message, CategoryChannel, Role, Guild, MessageEmbed, TextChannel } from 'discord.js'

import { Colours } from '../../util/Colours'

export default class Setup extends Command {
    public constructor () {
        super('setup', {
            aliases: ['setup'],
            category: 'Configuration',
            description: {
                    content: 'Setups modmail for your server',
                    usage: 'setup',
                    examples: ['setup']
            },
            channel: 'guild',
            ratelimit: 3
        })
    }

    //@ts-ignore
    userPermissions(message: Message) {
        const modRole = this.client.settings.get(message.guild, 'modRole', '')
        const hasStaffRole = message.member.permissions.has('MANAGE_GUILD', true) || message.member.roles.cache.has(modRole)

        if (!hasStaffRole) return 'Moderator'
        return null
    }

    private async createSupportRole(guild: Guild): Promise<Role> {
        return guild.roles.create({
                'name': 'Support',
                'hoist': true,
                'color': Colours.Pinky,
                'mentionable': false
        })
    }

    private async createModmailCategory(guild: Guild): Promise<CategoryChannel> {
        return guild.channels.create('Modmail', {
            'type': 'GUILD_CATEGORY', 
            'position': guild.channels.cache.filter(c => c.type === 'GUILD_CATEGORY').size
        })

    }

    private async createModmailChannel(guild: Guild, modmailCategory: CategoryChannel): Promise<TextChannel> {
        return guild.channels.create('modmail-logs', {
            'type': 'GUILD_TEXT',
            'topic': 'Modmail logs',
            'parent': modmailCategory
        })
    }

    public async exec(message: Message): Promise<Message> {
        const serverSetup: boolean = this.client.settings.get(message.guild, 'modmail.modmail-hasSetup', false)

        const e = new MessageEmbed()
            .setAuthor('Modmail Setup Complete', message.guild.icon)
            .setDescription(`This is the modmail logs channel. Logs of completed threads will be stored here.\n
            Anyone who can see this channel is able to use modmail commands.`)
            .setColor(Colours.BrandPink)

        if (!serverSetup) {
            message.channel.send('Please wait as this is a first time setup...')

            const supportRole = await this.createSupportRole(message.guild)
            const modmailCategory = await this.createModmailCategory(message.guild)
            const modmailChannel = await this.createModmailChannel(message.guild, modmailCategory)
                .then(tc => {
                    tc.permissionsFor(message.guild.roles.everyone).remove(['VIEW_CHANNEL', 'SEND_MESSAGES'])
                    tc.permissionsFor(supportRole).add('VIEW_CHANNEL')
                    return tc
                })

            if (!message.guild.channels.resolve(modmailChannel)) return message.channel.send('Failed to create the new modmail channel, please try again.')

            modmailChannel.send({ embeds: [e] })

            this.client.settings.setArr(message.guild, [
                {'key': 'modmail.support-role', 'value': supportRole.id},
                {'key': 'modmail.modmail-channel', 'value': modmailChannel.id},
                {'key': 'modmail.modmail-category', 'value': modmailCategory.id},
                {'key': 'modmail.modmail-hasSetup', 'value': true}
            ])

            setTimeout(() => { message.delete() }, 5000)
            await message.channel.send('Modmail has now been setup for this server.').then(msg => setTimeout(() => { msg.delete() }, 5000))
        }
        else {
            const modmailArr: string[] = this.client.settings.getArr(message.guild, [
                {'key': 'modmail.support-role', 'defaultValue': ''}, //modmailArr[0] - ROLE
                {'key': 'modmail.modmail-category', 'defaultValue': ''}, //modmailArr[1] - CATEGORY
                {'key': 'modmail.modmail-channel', 'defaultValue': ''} //modmailArr[2] - CHANNEL
            ])

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
                newTextChannel.send({ embeds: [e] })
            }

            setTimeout(() => { message.delete() }, 5000)
            await message.channel.send('Server modmail configuration has been updated!').then(msg => setTimeout(() => { msg.delete() }, 5000))
        }
    }
}