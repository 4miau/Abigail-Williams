import { Command } from 'discord-akairo'
import { GuildMember, Message, MessageEmbed } from 'discord.js'

export default class Nom extends Command {
    public constructor() {
        super('nom', {
            aliases: ['nom', 'noms'],
            category: 'Action',
            description: {
                content: 'Noms a user... is it tast- nevermind...',
                usage: 'nom [@user]',
                examples: ['nom @user'],
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
        if (member && member.user.id === message.author.id) return message.channel.send('You really shouldn\'t nom yourself...')
        
        const animeService = this.client.serviceHandler.modules.get('getanimesfw')
        const nomGif = await animeService.exec('nom')

        const e = new MessageEmbed()
            .setColor('RANDOM')
            .setImage(nomGif.url)

        if (!member) e.setDescription(`**${message.author.tag}** is nomming!`)
        else e.setDescription(`**${message.author.tag}** is nomming **${member.user.tag}!**`)

        return message.channel.send({ embeds: [e] })
    }
}