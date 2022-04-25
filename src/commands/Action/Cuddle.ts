import { Command } from 'discord-akairo'
import { GuildMember, Message, MessageEmbed } from 'discord.js'

export default class Cuddle extends Command {
    public constructor() {
        super('cuddle', {
            aliases: ['cuddle', 'cuddles', 'cuddling'],
            category: 'Action',
            description: {
                content: 'Cuddles a user',
                usage: 'cuddle [@user]',
                examples: ['cuddle @user'],
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
        if (!member) return message.util.send('Provide a member to cuddle.')
        if (member.user.id === message.author.id) return message.channel.send('You can\'t cuddle yourself! Don\'t be so lonely!')
        
        const animeService = this.client.serviceHandler.modules.get('getanimesfw')
        const cuddleGif = await animeService.exec('cuddle')

        const e = new MessageEmbed()
            .setDescription(`**${message.author.tag}** is cuddling **${member.user.tag}!**`)
            .setColor('RANDOM')
            .setImage(cuddleGif.url)
        
        return message.channel.send({ embeds: [e] })
    }
}