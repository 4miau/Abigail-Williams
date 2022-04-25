import { Listener } from 'discord-akairo'
import { Message, MessageEmbed, TextChannel, MessageAttachment } from 'discord.js'

import { Colours } from '../../../util/Colours'

export default class EditedMessages extends Listener {
    public constructor() {
        super('editedmessage', {
            emitter: 'client',
            event: 'messageUpdate',
            category: 'client',
        })
    }

    public async exec(oldMessage: Message, newMessage: Message) {
        if (oldMessage.partial) await oldMessage.fetch()
        if (oldMessage.author.bot) return
        if (oldMessage.content === newMessage.content) return

        const mtc: TextChannel = this.client.channels.cache.get(this.client.settings.get(newMessage.guild, 'logs.edited-messages', '')) as TextChannel
        let msgAttachments: MessageAttachment[] = [null, null] //[0] = oldMessage, [1] = newMessage
        const MAXMESSAGELENGTH = 5000

        if (oldMessage.content.length > 5000 || newMessage.content.length > 5000) {
            if (oldMessage.content.length > 5000) msgAttachments[0] = new MessageAttachment(Buffer.from(oldMessage.content))
            if (newMessage.content.length > 5000) msgAttachments[1] = new MessageAttachment(Buffer.from(newMessage.content))
        }

        const editMsgEmbed = new MessageEmbed()
            .setAuthor(`Message edited | ${newMessage.author.tag}`, newMessage.author.displayAvatarURL())
            .setColor(Colours.Orange)
            .addField('**Old Message Content:**', oldMessage.content?.substring(0, MAXMESSAGELENGTH), false)
            .addField('**New Message Content:**', newMessage.content?.substring(0, MAXMESSAGELENGTH), false)
            .addField('Author:', `${newMessage.author} (\`${newMessage.author.id}\`)`, true)
            .addField('Channel', `${newMessage.channel} (\`${newMessage.channel.id}\`)`, true)
            .setThumbnail(newMessage.author.displayAvatarURL({ dynamic: true}))

        if (mtc) mtc.send({ embeds: [editMsgEmbed] })
            .then(m => { 
                msgAttachments[0] ? m.attachments[0] = msgAttachments[0] : null //Testing
                msgAttachments[1] ? m.attachments[1] = msgAttachments[1] : null
            })
        // mtc.send({ embeds: [editMsgEmbed], files: [msgAttachments[0] ? msgAttachments[0] : void 0, msgAttachments[1] ? msgAttachments[1] : void 0] })

        if (mtc !== this.client.abbyLog) {
            newMessage.guild ? editMsgEmbed.setDescription(`**Server:** ${newMessage.guild.name} (${newMessage.guild.id})`) : void 0
            this.client.abbyLog.send({ embeds: [editMsgEmbed] })
            if (msgAttachments[0]) this.client.abbyLog.send({ files: [msgAttachments[0] ]})
            if (msgAttachments[1]) this.client.abbyLog.send({ files: [msgAttachments[1] ]})
        }
    }
}