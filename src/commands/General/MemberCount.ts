import { Command } from 'discord-akairo'
import { Message, MessageEmbed } from 'discord.js'

export default class MemberCount extends Command {
    public constructor() {
        super('membercount', {
            aliases: ['membercount', 'members'],
            category: 'General',
            description: {
                content: 'Gets the number of members in the server.',
                usage: 'membercount',
                examples: ['membercount'],
            },
            channel: 'guild',
            ratelimit: 3
        })
    }

    public exec(message: Message): Promise<Message> {
        const e = new MessageEmbed()
            .setTitle(`${message.guild.name} members`)
            .addField('Total', `${message.guild.members.cache.size}`, true)
            .addField('Humans', `${message.guild.members.cache.filter(m => !m.user.bot).size}`, true)
            .addField('Bots', `${message.guild.members.cache.filter(m => m.user.bot).size}`, true)

        return message.util.send({ embeds: [e] })
    }
}