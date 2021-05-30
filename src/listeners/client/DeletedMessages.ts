import { Listener } from "discord-akairo";
import { Message, MessageEmbed, TextChannel } from 'discord.js'

import { Colours } from "../../util/Colours";

export default class DeletedMessages extends Listener {
    public constructor() {
        super('messagedelete', {
            emitter: 'client',
            category: 'client',
            event: 'messageDelete',
        })
    }

    public async exec(message: Message): Promise<any> {
        if (message.partial || message.author.bot) return

        const gtc: TextChannel = this.client.channels.cache.get('842906441458384926') as TextChannel
        const mtc: TextChannel = this.client.channels.cache.get(this.client.settings.get(message.guild, 'logs.deleted-messages', '')) as TextChannel

        const delMsgEmbed = new MessageEmbed()
            .setAuthor(`Message deleted | ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true}))
            .setColor(Colours.Crimson)
            .addField('**Message Content:**', message.content)
            .addField('Author:', `${message.author} (\`${message.author.id}\`)`, true)
            .addField('Channel', `${message.channel} (\`${message.channel.id}\`)`, true)
            .setThumbnail(message.author.displayAvatarURL({ dynamic: true}))

        if (mtc) mtc.send(delMsgEmbed)

        delMsgEmbed.setDescription(`**Server:** ${message.guild.name} (${message.guild.id})`)
        gtc.send(delMsgEmbed)

        this.client.snipes.set(message.channel.id, {
            content: message.content,
            author: message.author.tag,
            member: message.member,
            image: message.attachments.first() ? message.attachments.first().proxyURL : null  
        })
    }
}