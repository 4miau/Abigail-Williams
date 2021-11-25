import { Listener } from 'discord-akairo'
import { Collection, Message, MessageEmbed, Snowflake, TextChannel } from 'discord.js'

import { createDelMsgFile } from '../../../util/functions/fileaccess'
import { Colours } from '../../../util/Colours'

export default class BulkDeletedMessages extends Listener {
    public constructor() {
        super('bulkdeletedmessages', {
            emitter: 'client',
            event: 'messageDeleteBulk',
            category: 'client',
        })
    }

    public exec(deletedMessages: Collection<Snowflake, Message>) {
        deletedMessages = deletedMessages.filter(dm => !dm.partial)

        if (deletedMessages.every(m => m.author.bot)) return
        if (deletedMessages.size <= 3) return

        createDelMsgFile(this.client, deletedMessages)

        const message = deletedMessages.first()

        if (message.guild) {
            const mtc: TextChannel = this.client.channels.cache.get(this.client.settings.get(message.guild, 'logs.deleted-messages', '')) as TextChannel

            const bulkDelMsgEmbed = new MessageEmbed()
                .setAuthor(`Bulk deleted messages | ${message.guild.name}`, message.guild.iconURL({ 'dynamic': true }))
                .setDescription(`Number of deleted messages: ${deletedMessages.size}`)
                .setColor(Colours.Crimson)

            if (mtc) mtc.send({ embeds: [bulkDelMsgEmbed] })
            if (mtc !== this.client.abbyLog) this.client.abbyLog.send({ embeds: [bulkDelMsgEmbed] })
            
        }
    }
}