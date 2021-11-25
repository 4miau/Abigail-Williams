import { Listener } from 'discord-akairo'
import { Message, MessageEmbed, TextChannel } from 'discord.js'

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

        const delMsgEmbed = new MessageEmbed()
            .setAuthor(`Message deleted | ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true}))
            .setColor(Colours.Crimson)
            .addField('**Message Content:**', message.content || 'No message content.')
            .addField('Author:', `${message.author} (\`${message.author.id}\`)`, true)
            .addField('Channel', `${message.channel} (\`${message.channel.id}\`)`, true)
            .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))

        if (mtc) mtc.send({ embeds: [delMsgEmbed] })

        
        if (mtc !== this.client.abbyLog) {
            delMsgEmbed.setDescription(`**Server:** ${message.guild.name} (${message.guild.id})`)
            this.client.abbyLog.send({ embeds: [delMsgEmbed] })
        }

        this.client.snipes.set(message.channel.id, {
            content: message.content,
            author: message.author.tag,
            member: message.member,
            image: message.attachments.first() ? message.attachments.first().proxyURL : null  
        })
    }
}