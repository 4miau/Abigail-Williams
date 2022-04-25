import { Command } from 'discord-akairo'
import { GuildMember, Message, MessageEmbed } from 'discord.js'

export default class Slap extends Command {
    public constructor() {
        super('slap', {
            aliases: ['slap', 'smack', 'educate'],
            category: 'Action',
            description: {
                content: 'Slaps a user',
                usage: 'slap [@user]',
                examples: ['slap @user'],
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
        if (!member) return message.channel.send('Please provide a member to slap')
        if (member.user.id === message.author.id) return message.channel.send('Trying to slap yourself... are you some kind of sadist?')
        
        const animeService = this.client.serviceHandler.modules.get('getanimesfw')
        const slapGif = await animeService.exec('slap')

        const e = new MessageEmbed()
            .setDescription(`**${message.author.tag}** has slapped **${member.user.tag}!** Ouch!`)
            .setColor('RANDOM')
            .setImage(slapGif.url)

        return message.channel.send({ embeds: [e] })
    }
}