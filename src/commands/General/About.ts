import { Command } from 'discord-akairo'
import { Message, MessageEmbed } from 'discord.js'
import { Colours } from '../../utils/Colours'
import { secondsConvert } from '../../utils/Constants'

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
            .setAuthor('abby-bot - About', message.guild.me.user.avatarURL({ 'dynamic': true }), message.guild.me.user.avatarURL({dynamic: true}))
            .setColor(Colours.NovaGreen)
            .setDescription(`**miau's discord bot.**`)
            .addField('Uptime', `${this.client.uptime / secondsConvert}s`, true)
            .addField('Latency', `${this.client.ws.ping}ms`, true)
            .addField('Version', '0.3.0', true) //IMPLEMENT AUTO UPDATE OF VERSION
            .addField('Author', `${this.client.users.resolve(this.client.ownerID.toString()).username}`, false)
            .addField('Support the bot!', `
                    I appreciate donations & support to help maintain the bot. Feel free to donate if you have even the slightest intention.\n
                    https://ko-fi.com/notmiauu
                `, false)
        )
    }
}