import { Command } from 'discord-akairo'
import { Message } from 'discord.js'
import { createRoleMenu, editRoleMenu, removeRoleMenu, resetRoleMenu, updateRoleMenu } from '../../util/functions/reactrole'

export default class RoleMenu extends Command {
    public constructor() {
        super('rolemenu', {
            aliases: ['rolemenu'],
            category: 'Reaction Roles',
            description: {
                content: 'Create, edit and manage a role menu.',
                usage: 'rolemenu [menuTag] <args> (see desc and tags)',
                examples: ['rolemenu create genders', 'rolemenu update genders -nodm 1234567890'],
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
        if (!args || !argsArr[0]) return message.channel.send('You must provide a tag to be able to access the role menu.')

        let roleGroups: RoleGroup[] = this.client.settings.get(message.guild, 'reaction.role-groups', [])
        if (roleGroups.arrayEmpty()) return message.channel.send('There are no reaction role groups, consider making a reaction role group first.')

        switch(argsArr[0].toLocaleLowerCase()) { //argsArr[0] = MenuTag
            case 'create': {
                await this.create(message, argsArr, roleGroups)
                break
            }
            case 'update': {
                await this.update(message, argsArr, roleGroups)
                break
            }
            case 'edit': {
                break
            }
            case 'remove': {
                await this.delete(message, argsArr, roleGroups)
                break
            }
            case 'reset': {
                await this.reset(message, argsArr, roleGroups)
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
        const m = this.getMessage(message, messageID)
        if (!m) return message.channel.send('Unable to find the message.')

        const updatedGroup = await createRoleMenu(message, roleGroups[groupIndex], m)
        if (!updatedGroup) return message.channel.send('Failed to complete the creation of the rolemenu, please try again.')
        roleGroups[groupIndex] = updatedGroup
        this.client.settings.set(message.guild, 'reaction.role-groups', roleGroups)
    } 

    private async update(message: Message, args: string[], roleGroups: RoleGroup[]) {
        const tag = args[1] || null
        if (!tag || !tag.caseCompare('-rr', '-nodm')) return message.channel.send('Must provide a valid tag for the message. (\'-rr\'/\'-nodm\')')

        const messageID = args[2] || null
        if (!messageID || isNaN(Number(messageID))) return message.channel.send('Provide a valid message ID.')

        const rgIndex = roleGroups.findIndex(rg => rg.messages.some(mArr => mArr.message === messageID))
        if (rgIndex === -1) return message.channel.send('This message does not belong to a group.')

        const newVal = args[3] || null
        if (!newVal || !newVal.caseCompare('true', 'false')) return message.channel.send('Must provide a valid value for the tag. (\'true\'/\'false\')')

        const updatedGroup = await updateRoleMenu(message, roleGroups[rgIndex], tag.toLocaleLowerCase() as ReactTags, messageID)
        if (!updatedGroup) return message.channel.send('Failed to complete the rolemenu, please try again.')
        roleGroups[rgIndex] = updatedGroup
        this.client.settings.set(message.guild, 'reaction.role-groups', roleGroups)
    }

    private async edit(message: Message, args: string[], roleGroups: RoleGroup[]) {
        const messageID = args[1] || null
        if (!messageID || isNaN(Number(messageID))) return message.channel.send('Provide a valid message ID.')

        const m = this.getMessage(message, messageID)
        if (!m) return message.channel.send('Unable to find the message.')
        
        const rgIndex = roleGroups.findIndex(rg => rg.messages.some(mArr => mArr.message === m.id))
        if (rgIndex === -1) return message.channel.send('There is no registered rolemenu attached to this message.')

        const updatedGroup = await editRoleMenu(message, roleGroups[rgIndex], m)
        if (!updatedGroup) return message.channel.send('Failed to edit the rolemenu please try again.')
        roleGroups[rgIndex] = updatedGroup
        this.client.settings.set(message.guild, 'reaction.role-groups', roleGroups)
    }

    private async delete(message: Message, args: string[], roleGroups: RoleGroup[]) {
        const messageID = args[1] || null
        if (!messageID || isNaN(Number(messageID))) return message.channel.send('Provide a valid message ID.')
        
        const m = this.getMessage(message, messageID)
        if (!m) return message.channel.send('Unable to find the message.')

        const rgIndex = roleGroups.findIndex(rg => rg.messages.some(mArr => mArr.message === m.id))
        if (rgIndex === -1) return message.channel.send('There is no registered rolemenu attached to this message.')

        const updatedGroup = await removeRoleMenu(message, roleGroups[rgIndex], m)
        if (!updatedGroup) return message.channel.send('Rolemenu')
    }

    private async reset(message: Message, args: string[], roleGroups: RoleGroup[]) {
        const messageID = args[1] || null
        if (!messageID || isNaN(Number(messageID))) return  message.channel.send('Must provide a message to reset the reactions of.')
        
        const rgIndex = roleGroups.findIndex(rg => rg.messages.some(m => m.message === args[1]))
        if (rgIndex === -1) return message.channel.send('Unable to find the role group this message belongs to.')

        const m = this.getMessage(message, messageID)
        if (!m) return message.channel.send('Unable to find the message in this guild.')

        const roleMsgIndex = roleGroups[rgIndex].messages.findIndex(msg => msg.message === m.id)
        const newMsgGroup = await resetRoleMenu(message, roleGroups[rgIndex].messages[roleMsgIndex], m)
        if (!newMsgGroup) return
        roleGroups[rgIndex].messages[roleMsgIndex] = newMsgGroup
        this.client.settings.set(message.guild, 'reaction.role-groups', roleGroups)
    } 
    //TODO: Fix emote detection and editing original message if sent by bot

    private getMessage = (message: Message, id: string): Message => {
        for (const channel of message.guild.channels.cache.values()) {
            if (!channel.isText()) continue
            if (channel.messages.resolve(id)) return channel.messages.resolve(id)
        }
        return null
    }
}