import { Listener } from "discord-akairo";
import { Message, MessageEmbed, TextChannel } from 'discord.js'

import { Colours } from "../../util/Colours";

export default class DeletedMessages extends Listener {
    public constructor() {
        super('messagedelete', {
            'emitter': 'client',
            category: 'client',
            'event': 'messageDelete',
        })
    }

    public async exec(message: Message): Promise<any> {
        if (message.partial || message.author.bot) return

        const gtc: TextChannel = this.client.channels.cache.get('842906441458384926') as TextChannel
        const mtc: TextChannel = this.client.channels.cache.get(this.client.settings.get(message.guild, 'config.message-log', '')) as TextChannel

        const delMsgEmbed = new MessageEmbed()
            .setAuthor(`Message deleted | ${message.author.tag}`, message.author.displayAvatarURL({ 'dynamic': true}))
            .setDescription(`**Message Content:**\n${message.content}`)
            .setColor(Colours.Crimson)
            .addField('Author:', `${message.author} (\`${message.author.id}\`)`, true)
            .addField('Channel', `${message.channel} (\`${message.channel.id}\`)`, true)
            .setThumbnail(message.author.displayAvatarURL({ 'dynamic': true}))

        gtc.send(delMsgEmbed)
        if (mtc) mtc.send(delMsgEmbed)
    }
}