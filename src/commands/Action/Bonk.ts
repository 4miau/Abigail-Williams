import { Command } from 'discord-akairo'
import { GuildMember, Message, MessageEmbed } from 'discord.js'

export default class Bonk extends Command {
    public constructor() {
        super('bonk', {
            aliases: ['bonk', 'bonks'],
            category: 'Action',
            description: {
                content: 'Bonks a user',
                usage: 'bonk [@user]',
                examples: ['bonk @user'],
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
        if (!member) return message.channel.send('Provide a member to bonk!')
        if (member.user.id === message.author.id) return message.channel.send('You really shouldn\'t bonk yourself.')
        
        const animeService = this.client.serviceHandler.modules.get('getanimesfw')
        const bonkGif = await animeService.exec('bonk')

        const e = new MessageEmbed()
            .setDescription(`**${message.author.tag}** bonked **${member.user.tag}!**`)
            .setColor('RANDOM')
            .setImage(bonkGif.url)

        return message.util.send({ embeds: [e] })
    }
}