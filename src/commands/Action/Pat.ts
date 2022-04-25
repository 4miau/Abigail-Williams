import { Command } from 'discord-akairo'
import { GuildMember, Message, MessageEmbed } from 'discord.js'

export default class Pat extends Command {
    public constructor() {
        super('pat', {
            aliases: ['pat', 'pats', 'pattu'],
            category: 'Action',
            description: {
                content: 'Pats a user',
                usage: 'pat [@user]',
                examples: ['pat @user'],
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
        const patGif = await animeService.exec('pat')

        const e = new MessageEmbed()
            .setColor('RANDOM')
            .setImage(patGif.url)

        if (!member || member.user.id === message.author.id) e.setDescription(`**${message.author.tag}** has patted themselves!?`)
        else e.setDescription(`**${message.author.tag}** has patted **${member.user.tag}!**`)

        return message.channel.send({ embeds: [e] })
    }
}