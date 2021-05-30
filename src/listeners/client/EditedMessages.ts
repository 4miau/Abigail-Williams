import { Listener } from 'discord-akairo'
import { Message, MessageEmbed, TextChannel } from 'discord.js'

import { Colours } from '../../util/Colours'

export default class EditedMessages extends Listener {
    public constructor() {
        super('editedmessage', {
            event: 'messageUpdate',
            type: 'client',
            emitter: 'client'
        })
    }

    public async exec(oldMessage: Message, newMessage: Message) {
        if (oldMessage.partial) await oldMessage.fetch()
        if (oldMessage.author.bot) return;
        if (oldMessage.content === newMessage.content) return;

        const gtc: TextChannel = this.client.channels.cache.get('842906441458384926') as TextChannel
        const mtc: TextChannel = this.client.channels.cache.get(this.client.settings.get(newMessage.guild, 'logs.edited-messages', '')) as TextChannel

        const editMsgEmbed = new MessageEmbed()
            .setAuthor(`Message edited | ${newMessage.author.tag}`, newMessage.author.displayAvatarURL())
            
            .setColor(Colours.Orange)
            .addField('**Old Message Content:**', oldMessage.content, false)
            .addField('**New Message Content:', newMessage.content, false)
            .addField('Author:', `${newMessage.author} (\`${newMessage.author.id}\`)`, true)
            .addField('Channel', `${newMessage.channel} (\`${newMessage.channel.id}\`)`, true)
            .setThumbnail(newMessage.author.displayAvatarURL({ dynamic: true}))

        if (mtc) mtc.send(editMsgEmbed)

        editMsgEmbed.setDescription(`**Server:** ${newMessage.guild.name} (${newMessage.guild.id})`)
        gtc.send(editMsgEmbed)
    }
}