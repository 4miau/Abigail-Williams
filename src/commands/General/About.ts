import { Command } from 'discord-akairo'
import { Message, MessageEmbed } from 'discord.js'
import { stripIndents } from 'common-tags'
import moment from 'moment'

import { Colours } from '../../util/Colours'
import { botVersion } from '../../Config'


export default class About extends Command {
    public constructor() {
        super('about', {
            aliases: ['about', 'botinfo'],
            category: 'General',
            description: {
                    content: 'Displays information about the bot',
                    usage: 'about',
                    examples: ['about']
            },
            ratelimit: 3
        })
    }

    public exec(message: Message): Promise<Message> {
        return message.util!.send(new MessageEmbed()
            .setAuthor('abby-bot - About', this.client.user.avatarURL({ 'dynamic': true }), this.client.user.avatarURL({dynamic: true, format: 'png' }))
            .setColor(Colours.NovaGreen)
            .setDescription(`**Hi! I'm Abigail Williams, a cute bot created by miau!**`)
            .setThumbnail(this.client.user.avatarURL({dynamic: true, format: 'png' }))
            .addField('Uptime', `${moment((this.client.uptime)).format('HH:mm:ss')}s`, true)
            .addField('Latency', `${this.client.ws.ping}ms`, true)
            .addField('Version', `v${botVersion}`, true) //IMPLEMENT AUTO UPDATE OF VERSION
            .addField('Author', `${this.client.users.resolve(this.client.ownerID.toString()).username}`, false)
            .addField('Support the bot!', (stripIndents`
                    I appreciate donations & support to help maintain the bot. Feel free to donate if you have even the slightest intention.
                    https://ko-fi.com/notmiauu
                `), false)
            .setFooter('Powered by the cutie miau.')
        )
    }
}