import { Listener } from 'discord-akairo'
import { Message, MessageEmbed, TextChannel, MessageAttachment } from 'discord.js'

import { Colours } from '../../../util/Colours'

export default class DeletedMessages extends Listener {
    public constructor() {
        super('messagedelete', {
            emitter: 'client',
            event: 'messageDelete',
            category: 'client',
        })
    }

    public async exec(message: Message): Promise<any> {
        if (message.partial || message.author.bot || message.channel.type === 'DM') return

        const mtc: TextChannel = this.client.channels.cache.get(this.client.settings.get(message.guild, 'logs.deleted-messages', '')) as TextChannel
        const msgAttachment = message.content.length > 5000 ? new MessageAttachment(Buffer.from(message.content), 'message.txt') : null
        const MAXMESSAGELENGTH = 5000

        const delMsgEmbed = new MessageEmbed()
            .setAuthor(`Message deleted | ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true}))
            .setColor(Colours.Crimson)
            .addField('**Message Content:**', message.content?.substring(0, MAXMESSAGELENGTH) || 'No message content.') //5000 is considered 'too large' in this
            .addField('Author:', `${message.author} (\`${message.author.id}\`)`, true)
            .addField('Channel', `${message.channel} (\`${message.channel.id}\`)`, true)
            .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))

        if (mtc) msgAttachment ? mtc.send({ embeds: [delMsgEmbed], files: [msgAttachment] }) : mtc.send({ embeds: [delMsgEmbed] })

        if (mtc !== this.client.abbyLog) {
            delMsgEmbed.setDescription(`**Server:** ${message.guild.name} (${message.guild.id})`)
            msgAttachment ? this.client.abbyLog.send({ embeds: [delMsgEmbed], files: [msgAttachment] }) : this.client.abbyLog.send({ embeds: [delMsgEmbed] })
        }

        this.client.snipes.set(message.channel.id, {
            content: message.content,
            author: message.author.tag,
            member: message.member,
            image: message.attachments.first() ? message.attachments.first().proxyURL : null  
        })
    }
}