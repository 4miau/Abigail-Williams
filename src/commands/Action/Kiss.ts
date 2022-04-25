import { Command } from 'discord-akairo'
import { GuildMember, Message, MessageEmbed } from 'discord.js'

export default class Kiss extends Command {
    public constructor() {
        super('kiss', {
            aliases: ['kiss', 'kisses'],
            category: 'Action',
            description: {
                content: 'Kisses a user',
                usage: 'kiss [@user]',
                examples: ['kiss @user'],
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
        if (!member) return message.channel.send('Provide a member to kiss.')
        if (member.user.id === message.author.id) return message.channel.send('You can\'t kiss yourself!')
        
        const animeService = this.client.serviceHandler.modules.get('getanimesfw')
        const kissGif = await animeService.exec('kiss')

        const e = new MessageEmbed()
            .setDescription(`**${message.author.tag}** has kissed **${member.user.tag}!** Woah!`)
            .setColor('RANDOM')
            .setImage(kissGif.url)

        return message.channel.send({ embeds: [e] })
    }
}