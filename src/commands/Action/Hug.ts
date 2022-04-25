import { Command } from 'discord-akairo'
import { GuildMember, Message, MessageEmbed } from 'discord.js'

export default class Hug extends Command {
    public constructor() {
        super('hug', {
            aliases: ['hug', 'huggies'],
            category: 'Action',
            description: {
                content: 'Hugs a user',
                usage: 'hug [@user]',
                examples: ['hug @user'],
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
        if (!member) return message.util.send('Please provide a member to hug.')
        
        const animeService = this.client.serviceHandler.modules.get('getanimesfw')
        const hugGif = await animeService.exec('hug')

        const e = new MessageEmbed()
            .setColor('RANDOM')
            .setImage(hugGif.url)
        
        if (member.user.id === message.author.id) e.setDescription(`**${member.user.tag}** has hugged themselves! (Must be lonely)`)
        else e.setDescription(`**${message.author.tag}** has hugged **${member.user.tag}!**`)
        
        return message.channel.send({ embeds: [e] })
    }
}