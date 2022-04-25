import { Command } from 'discord-akairo'
import { GuildMember, Message, MessageEmbed } from 'discord.js'

export default class Wave extends Command {
    public constructor() {
        super('wave', {
            aliases: ['wave', 'waves'],
            category: 'Action',
            description: {
                content: 'Waves (possibly at someone)',
                usage: 'wave <@user>',
                examples: ['wave', 'wave @user'],
            },
            ratelimit: 3,
            args: [
                {
                    id: 'member',
                    type: 'member'
                }
            ]
        })
    }

    public async exec(message: Message, {member}: {member: GuildMember}): Promise<Message> {
        const animeService = this.client.serviceHandler.modules.get('getanimesfw')
        const waveGif = await animeService.exec('wave')

        const e = new MessageEmbed()
            .setColor('RANDOM')
            .setImage(waveGif.url)

        if (!member || member.user.id === message.author.id) e.setDescription(`**${message.author.tag}** is waving!`)
        else e.setDescription(`**${message.author.tag}** is waving at **${member.user.tag}**!`)

        return message.channel.send({ embeds: [e] })
    }
}