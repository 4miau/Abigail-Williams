import { Command } from 'discord-akairo'
import { Message, MessageEmbed } from 'discord.js'
import Service from '../../modules/Service'

export default class RoleMenu extends Command {
    roleMenuServices: Service[]

    public constructor() {
        super('rolemenu', {
            aliases: ['rolemenu'],
            category: 'Reaction Roles',
            description: {
                content: 'Create, edit and manage a role menu.',
                usage: 'rolemenu [menuTag] <args/-h> (run -h after a tag for help)',
                examples: ['rolemenu create genders', 'rolemenu update -nodm 1234567890 true'],
                tags: ['create', 'update', 'edit', 'remove', 'reset']
            },
            channel: 'guild',
            ratelimit: 3,
            args: [
                {
                    id: 'args',
                    type: 'string',
                    match: 'rest'
                }
            ]
        })
    }

    public async exec(message: Message, {args}: {args: string}): Promise<Message> {
        const argsArr = args?.split(' ')
        if (!args || !argsArr[0]) return message.channel.send('Provide a tag to access the role menu (input \'-h\' after the tag for help).')

        let roleGroups: RoleGroup[] = this.client.settings.get(message.guild, 'role-groups', [])
        if (roleGroups.arrayEmpty()) return message.channel.send('There are no reaction role groups, create a reaction role group first.')

        this.roleMenuServices = this.client.serviceHandler.modules.getArr(
            'createrolemenu', 'editrolemenu', 'removerolemenu', 'resetrolemenu', 'updaterolemenu'
        )

        switch(argsArr[0].toLocaleLowerCase()) { //argsArr[0] = MenuTag
            case 'create': {
                if (argsArr[1] && argsArr[1].caseCompare('-h')) return message.channel.send({ embeds: [this.helpEmbed('create')] })
                else await this.create(message, argsArr, roleGroups)
                break
            }
            case 'update': {
                if (argsArr[1] && argsArr[1].caseCompare('-h')) return message.channel.send({ embeds: [this.helpEmbed('update')] })
                else await this.update(message, argsArr, roleGroups)
                break
            }
            case 'edit': {
                if (argsArr[1] && argsArr[1].caseCompare('-h')) return message.channel.send({ embeds: [this.helpEmbed('edit')] })
                else await this.edit(message, argsArr, roleGroups)
                break
            }
            case 'remove': {
                if (argsArr[1] && argsArr[1].caseCompare('-h')) return message.channel.send({ embeds: [this.helpEmbed('remove')] })
                else await this.delete(message, argsArr, roleGroups)
                break
            }
            case 'reset': {
                if (argsArr[1] && argsArr[1].caseCompare('-h')) return message.channel.send({ embeds: [this.helpEmbed('reset')] })
                else await this.reset(message, argsArr, roleGroups)
                break
            }
            default: 
                return message.channel.send('Please provide a valid tag for accessing the role menu.')
        }
    }

    private async create(message: Message, args: string[], roleGroups: RoleGroup[]) { 
        const groupName = args[1] || null

        if (!groupName || !roleGroups.find(rg => rg.groupName.caseCompare(groupName))) return message.channel.send('Unable to find this group.')

        const groupIndex = roleGroups.findIndex(rg => rg.groupName.caseCompare(groupName))
        let messageID = args[2] && args[2].caseCompare('-m') ? args[3] : null
        this.client.logger.log('INFO', messageID)
        const m = await this.getMessage(message, messageID)

        const updatedGroup = await this.roleMenuServices[0].exec(message, roleGroups[groupIndex], m)
        if (!updatedGroup) return message.channel.send('Failed to complete the creation of the rolemenu, please try again.')
        roleGroups[groupIndex] = updatedGroup
        this.client.settings.set(message.guild, 'role-groups', roleGroups)
    } 

    private async update(message: Message, args: string[], roleGroups: RoleGroup[]) { 
        const tag = args[1] || null
        if (!tag || !tag.caseCompare('-rr', '-nodm')) return message.channel.send('Must provide a valid tag for the message. (\'-rr\'/\'-nodm\')')

        const messageID = args[2] || null
        if (!messageID || isNaN(Number(messageID))) return message.channel.send('Provide a valid message ID.')

        const rgIndex = roleGroups.findIndex(rg => rg.messages.some(mArr => mArr.message === messageID))
        if (rgIndex === -1) return message.channel.send('This message does not belong to a group.')

        const updatedGroup = await this.roleMenuServices[4].exec(message, roleGroups[rgIndex], tag.toLowerCase() as ReactTags, messageID)
        if (!updatedGroup) return message.channel.send('Failed to complete the rolemenu, please try again.')
        roleGroups[rgIndex] = updatedGroup
        this.client.settings.set(message.guild, 'role-groups', roleGroups)
    }

    private async edit(message: Message, args: string[], roleGroups: RoleGroup[]) { 
        const messageID = args[1] || null
        if (!messageID || isNaN(Number(messageID))) return message.channel.send('Provide a valid message ID.')

        const m = await this.getMessage(message, messageID)
        if (!m) return message.channel.send('Unable to find the message.')
        
        const rgIndex = roleGroups.findIndex(rg => rg.messages.some(mArr => mArr.message === m.id))
        if (rgIndex === -1) return message.channel.send('There is no registered rolemenu attached to this message.')

        const updatedGroup = await this.roleMenuServices[1].exec(message, roleGroups[rgIndex], m)
        if (!updatedGroup) return message.channel.send('Failed to edit the rolemenu please try again.')
        roleGroups[rgIndex] = updatedGroup
        this.client.settings.set(message.guild, 'role-groups', roleGroups)
    }

    private async delete(message: Message, args: string[], roleGroups: RoleGroup[]) { 
        const messageID = args[1] || null
        if (!messageID || isNaN(Number(messageID))) return message.channel.send('Provide a valid message ID.')
        
        const m = await this.getMessage(message, messageID)
        if (!m) return message.channel.send('Unable to find the message.')

        const rgIndex = roleGroups.findIndex(rg => rg.messages.some(mArr => mArr.message === m.id))
        if (rgIndex === -1) return message.channel.send('There is no registered rolemenu attached to this message.')

        const updatedGroup = await this.roleMenuServices[2].exec(message, roleGroups[rgIndex], m)
        if (!updatedGroup) return message.channel.send('Rolemenu')
    }

    private async reset(message: Message, args: string[], roleGroups: RoleGroup[]) { 
        const messageID = args[1] || null
        if (!messageID || isNaN(Number(messageID))) return  message.channel.send('Must provide a message to reset the reactions of.')
        
        const rgIndex = roleGroups.findIndex(rg => rg.messages.some(m => m.message === args[1]))
        if (rgIndex === -1) return message.channel.send('Unable to find the role group this message belongs to.')

        const m = await this.getMessage(message, messageID)
        if (!m) return message.channel.send('Unable to find the message in this guild.')

        const roleMsgIndex = roleGroups[rgIndex].messages.findIndex(msg => msg.message === m.id)
        const newMsgGroup = await this.roleMenuServices[3].exec(message, roleGroups[rgIndex].messages[roleMsgIndex], m)
        if (!newMsgGroup) return
        roleGroups[rgIndex].messages[roleMsgIndex] = newMsgGroup
        this.client.settings.set(message.guild, 'role-groups', roleGroups)
    } 
    //TODO: Fix emote detection and editing original message if sent by bot

    private helpEmbed(type: string) {
        if (!type.caseCompare('create', 'update', 'edit', 'remove', 'reset')) {
            return new MessageEmbed()
                .setDescription('You must provide a tag to be able to access the role menu.')
        }

        const e = new MessageEmbed()
            .setAuthor('Rolemenu Help', this.client.user.avatarURL())
            .setFooter('Key: [] = required, <> = optional')

        switch (type) {
            case 'create': { //rolemenu create [groupname] <-m messageID>
                e.setDescription(
                    'Creates a new rolemenu instance, optionally from an existing message.\n' + 
                    'Arguments: rolemenu create [group-name] <-m messageID>'
                )
                return e
            }
            case 'update': { //rolemenu update [-rr/-nodm] [messageID]
                e.setDescription(
                    'Update a rolemenu instance config\n' +
                    '*-rr*: Reset role, will remove role if a user unreacts\n' + 
                    '*-nodm*: No DM, will not DM a user if they gain/lose a role from reacting/unreacting.\n' + 
                    'Arguments: rolemenu update [-rr/-nodm] [messageID]'
                )
                return e
            }
            case 'edit': { //rolemenu edit [messageID]
                e.setDescription(
                    'Edit a rolemenu instance to change the emojis for each role.\n' +
                    'Arguments: rolemenu edit [messageID]'
                )
                return e
            }
            case 'remove': { //rolemenu remove [messageID]
                e.setDescription(
                    'Removes a rolemenu instance, will remove reacts and the message **IF** it was created by the bot\n' +
                    'Arguments: rolemenu remove [messageID]'
                )
                return e
            }
            case 'reset': { //rolemenu reset [messageID]
                e.setDescription(
                    'Resets a rolemenu instance allowing ALL reacts and emotes to be changed' +
                    'Arguments: rolemenu reset [messageID]'
                )
                return e
            }
            default: { return null }
        }

    }

    private getMessage = async (message: Message, id: string): Promise<Message> => {
        for (const channel of message.guild.channels.cache.values()) {
            if (channel.isText()) {
                try {
                    await new Promise((res, rej) => channel.messages.fetch(id, { force: false }).then(res).catch(rej))
                    return channel.messages.resolve(id)
                } catch {
                    continue
                }
            }
        }
        return null
    }
}