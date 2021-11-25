import { Command } from 'discord-akairo'
import { Message, MessageEmbed } from 'discord.js'
import moment from 'moment'

import { Colours } from '../../util/Colours'
import { envs } from '../../client/Components'


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
        const e = new MessageEmbed()
            .setAuthor('abby-bot - About', this.client.user.avatarURL({ 'dynamic': true }), this.client.user.avatarURL({dynamic: true, format: 'png' }))
            .setColor(Colours.NovaGreen)
            .setDescription('**Hi! I\'m Abigail Williams, a cute bot created by miau!**')
            .setThumbnail(this.client.user.avatarURL({dynamic: true, format: 'png' }))
            .addField('Uptime', `${moment((this.client.uptime)).utcOffset(0).format('HH:mm:ss')}s`, true)
            .addField('Latency', `${this.client.ws.ping}ms`, true)
            .addField('Version', `v${envs.botVersion}`, true) //IMPLEMENT AUTO UPDATE OF VERSION
            .addField('Author', `${this.client.users.resolve(this.client.ownerID.toString()).username}`, false)
            .addField('Support the bot!', 
                'I appreciate donations & support to help maintain the bot. Feel free to dnate if you have even the slightest intention.\nhttps://ko-fi.com/notmiauu',
                false)
            .setFooter('Powered by the cutie miau.')

        return message.channel.send({ embeds: [e] })
    }
}