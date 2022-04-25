import { Message } from 'discord.js'

import Service from '../../modules/Service'

export default class UpdateRoleMenu extends Service {
    public constructor() {
        super('updaterolemenu', {
            category: 'Reaction Role'
        })
    }

    async exec(msg: Message, group: RoleGroup, tag: ReactTags, messageID: string, newMsg: string = null) {
        const msgIndex = group.messages.findIndex(msgArr => msgArr.message === messageID)
        if (msgIndex === -1) return

        if (tag === '-nodm') group.messages[msgIndex].nodm = !group.messages[msgIndex].nodm
        else if (tag === '-rr') group.messages[msgIndex].nodm = !group.messages[msgIndex].rr
        else if (tag === '-m') {
            //const newMsg = await this.getMessage(msg, newMsg)
        }
        else return
    
        const { message: m, nodm, rr } = group.messages[msgIndex]
    
        msg.channel.send(
            'Rolemenu has successfully been updated!\n\n' +
            'Flags:\n' +
            `\`-nodm: ${nodm}\` toggle with \`rolemenu update -nodm ${messageID}\`: disables dm messages.\n` +
            `\`-rr: ${rr}\` toggle with \`rolemenu update -rr ${messageID}\`: removing reactions removes the role.`
        )
    
        return group
    }

    private getMessage = async (message: Message, id: string): Promise<Message> => {
        for (const channel of message.guild.channels.cache.values()) {
            this.client.logger.log('INFO', channel.name)
            if (channel.isText()) {
                try {
                    await new Promise((res, rej) => channel.messages?.fetch(id, { force: false }).then(res).catch(rej))
                    return channel.messages.resolve(id)
                } catch {
                    continue
                }
            }
        }
        return null
    }
}