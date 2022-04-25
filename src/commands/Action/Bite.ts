/* eslint-disable linebreak-style */
import { Command } from 'discord-akairo'
import { GuildMember, Message, MessageEmbed } from 'discord.js'

export default class Bite extends Command {
    public constructor() {
        super('bite', {
            aliases: ['bite', 'bites'],
            category: 'Action',
            description: {
                content: 'Bites a user',
                usage: 'bite [@user]',
                examples: ['bite @user'],
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
        if (!member) return message.channel.send('Provide a member to bite.')
        if (member.user.id === message.author.id) return message.channel.send('Biting yourself? Don\'t be so weird!')
        
        const animeService = this.client.serviceHandler.modules.get('getanimesfw')      
        const biteGif = await animeService.exec('bite')

        const e = new MessageEmbed()
            .setDescription(`**${message.author.tag}** bit **${member.user.tag}!** Ouch!`)
            .setColor('RANDOM')
            .setImage(biteGif.url)

        return message.channel.send({ embeds: [e] })
    }
}