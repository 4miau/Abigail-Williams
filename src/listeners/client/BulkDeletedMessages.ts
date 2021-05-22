import { Listener } from 'discord-akairo'
import { Collection, Message, MessageEmbed, Snowflake, TextChannel } from 'discord.js'

import { createDelMsgFile } from '../../util/Functions'
import { Colours } from '../../util/Colours'

export default class BulkDeletedMessages extends Listener {
    public constructor() {
        super('bulkdeletedmessages', {
            emitter: 'client',
            category: 'client',
            event: 'messageDeleteBulk',
            
        })
    }

    public exec(deletedMessages: Collection<Snowflake, Message>) {
        deletedMessages = deletedMessages.filter(dm => !dm.partial)

        if (deletedMessages.every(m => m.author.bot)) return;
        if (deletedMessages.size <= 3) return;

        createDelMsgFile(this.client, deletedMessages)

        const message = deletedMessages.first()
         
        const gtc: TextChannel = this.client.channels.cache.get('842906441458384926') as TextChannel
        const mtc: TextChannel = this.client.channels.cache.get(this.client.settings.get(message.guild, 'logs.deleted-messages', '')) as TextChannel

        const bulkDelMsgEmbed = new MessageEmbed()
            .setAuthor(`Bulk deleted messages | ${message.guild.name}`, message.guild.iconURL({ 'dynamic': true }))
            .setDescription(`Number of deleted messages: ${deletedMessages.size}`)
            .setColor(Colours.Crimson)

        gtc.send(bulkDelMsgEmbed)
        if (mtc) mtc.send(bulkDelMsgEmbed)
    }


}