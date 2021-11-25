import { Command } from 'discord-akairo'
import { Message, MessageEmbed } from 'discord.js'

export default class GuildIcon extends Command {
    public constructor() {
        super('guildicon', {
            aliases: ['guildicon'],
            category: 'Utility',
            description: {
                content: 'Gets the icon of the guild.',
                usage: 'guildicon',
                examples: ['guildicon'],
            },
            channel: 'guild',
            ratelimit: 3
        })
    }

    public async exec(message: Message): Promise<Message> {
        const e = new MessageEmbed()
            .setAuthor(`${message.guild.name} icon`, message.guild.iconURL({ dynamic: true }))
            .setThumbnail(message.guild.iconURL({ dynamic: true, format: 'png' }))

        return message.channel.send({ embeds: [e] })
    }
}