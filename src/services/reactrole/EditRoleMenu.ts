import { Message } from 'discord.js'

import Service from '../../modules/Service'

export default class EditRoleMenu extends Service {
    public constructor() {
        super('editrolemenu', {
            category: 'Reaction Role'
        })
    }

    async exec(message: Message, group: RoleGroup, msg: Message): Promise<any> {
        const msgIndex = group.messages.findIndex(mArr => mArr.message === msg.id)
    
        if (msg.author === message.client.user) {
            await msg.fetch()
            const reactMsg = await message.channel.send(`Editing existing rolemenu... [0/${group.roles.length}]`)
            let lastContent = ''
    
            for (let [i, r] of group.messages[msgIndex].reacts.entries()) {
                if (r.role !== group.roles[i]) group.messages[msgIndex].reacts[i].role = group.roles[i]
                const role = message.guild.roles.resolve(r.role)
                if (!role) return null
    
                reactMsg.edit(
                    `Rolemenu setup: [${i + 1}/${group.messages[msgIndex].reacts.length}]` +
                    `React with the emoji for the role command: \`${role.name}\`` +
                    'Note: The bot must be in the server the emoji is from, else it will fail\n\n' +
                    'Throughout the setup, the original message will be updated.'
                )
    
                const emote = await this.getReactEmoteService().exec(message, reactMsg, msg)
                await msg.reactions.cache.find(react => react.emoji.identifier === r.emoji).remove()
                group.messages[msgIndex].reacts[i].emoji = emote.identifier
                msg.react(emote)
    
                if (i === 0) message.edit(`**Role Menu: ${group.groupName}**\n\n` + `${emote}: \`${role.name}\``).then(m => lastContent = m.content)
                else if (!msg) message.edit(`${lastContent}\n` + `${emote}: \`${role.name}\``)
            }
    
            reactMsg.edit(
                'Successfully edited existing rolemenu! You can now delete all messages (except for the menu itself)\n\n' +
                'Flags:\n' +
                `\`-nodm: ${group.messages[msgIndex].nodm}\` toggle with \`rolemenu update -nodm ${message.id}\`: disables dm messages.\n` +
                `\`-rr: ${group.messages[msgIndex].rr}\` toggle with \`rolemenu update -rr ${message.id}\`: removing reactions removes the role.`
            )
        } else {
            await msg.fetch()
            const reactMsg = await message.channel.send(`Editing existing rolemenu... [0/${group.roles.length}]`)
    
            for (let [i, r] of group.messages[msgIndex].reacts.entries()) {
                const role = message.guild.roles.resolve(r.role)
                if (!role) return null
    
                reactMsg.edit(
                    `Rolemenu setup: [${i + 1}/${group.messages[msgIndex].reacts.length}]` +
                    `React with the emoji for the role command: \`${role.name}\`` +
                    'Note: The bot must be in the server the emoji is from, else it will fail\n\n' +
                    'Throughout the setup, the original message will be updated.'
                )
    
                const emote = await this.getReactEmoteService().exec(message, reactMsg, msg)
                await msg.reactions.cache.find(react => react.emoji.identifier === r.emoji).remove()
                group.messages[msgIndex].reacts[i].emoji = emote.identifier
                await msg.react(emote)
            }
        }
    }

    private getReactEmoteService() { return this.handler.modules.get('getreactemote') }
}

//TODO: Optimize this horse crap