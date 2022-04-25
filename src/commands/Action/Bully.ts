import { Command } from 'discord-akairo'
import { GuildMember, Message, MessageEmbed } from 'discord.js'

export default class Bully extends Command {
    public constructor() {
        super('bully', {
            aliases: ['bully', 'bullies'],
            category: 'Action',
            description: {
                content: 'Bullies a user',
                usage: 'bully [@user]',
                examples: ['bully @user'],
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
        if (!member) return message.channel.send('Provide a member to bully!')
        if (member.user.id === message.author.id) return message.channel.send('You can\'t bully yourself... that\'s just weird.')
        
        const animeService = this.client.serviceHandler.modules.get('getanimesfw')
        const bullyGif = await animeService.exec('bully')

        const e = new MessageEmbed()
            .setDescription(`**${message.author.tag}** is bullying **${member.user.tag}!**`)
            .setColor('RANDOM')
            .setImage(bullyGif.url)

        return message.channel.send({ embeds: [e] })
    }
}