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
        if (oldMessage.partial || oldMessage.author.bot) return

        const gtc: TextChannel = this.client.channels.cache.get('842906441458384926') as TextChannel
        const mtc: TextChannel = this.client.channels.cache.get(this.client.settings.get(newMessage.guild, 'logs.edited-messages', '')) as TextChannel

        const editMsgEmbed = new MessageEmbed()
            .setAuthor(`Message edited | ${newMessage.author.tag}`, newMessage.author.displayAvatarURL())
            .setDescription(`
                **Old Message Content:**
                ${oldMessage.content}
                **New Message Content:**
                ${newMessage.content}
            `)
            .setColor(Colours.Orange)
            .addField('Author:', `${newMessage.author} (\`${newMessage.author.id}\`)`, true)
            .addField('Channel', `${newMessage.channel} (\`${newMessage.channel.id}\`)`, true)
            .setThumbnail(newMessage.author.displayAvatarURL({ dynamic: true}))

        gtc.send(editMsgEmbed)
        if (mtc) mtc.send(editMsgEmbed)
    }
}