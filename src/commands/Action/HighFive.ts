import { Command } from 'discord-akairo'
import { GuildMember, Message, MessageEmbed } from 'discord.js'

export default class HighFive extends Command {
    public constructor() {
        super('highfive', {
            aliases: ['highfive', 'highfives', 'high five', 'high fives'],
            category: 'Action',
            description: {
                content: 'Highfives a user.',
                usage: 'highfive [@user]',
                examples: ['highfive @user'],
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
        if (!member) return message.channel.send('Provide a member to highfive!')
        if (member.user.id === message.author.id) return message.channel.send('Highfiving yourself... are you really that lonely?')
        
        const animeService = this.client.serviceHandler.modules.get('getanimesfw')
        const highFiveGif = await animeService.exec('highfive')

        const e = new MessageEmbed()
            .setDescription(`**${message.author.tag}** has highfived **${member.user.tag}!**`)
            .setColor('RANDOM')
            .setImage(highFiveGif.url)

        return message.channel.send({ embeds: [e] })
    }
}