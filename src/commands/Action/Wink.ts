import { Command } from 'discord-akairo'
import { GuildMember, Message, MessageEmbed } from 'discord.js'

export default class Wink extends Command {
    public constructor() {
        super('wink', {
            aliases: ['wink', 'winks'],
            category: 'Action',
            description: {
                content: 'Winks at a user...',
                usage: 'wink [@user]',
                examples: ['wink @user'],
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
        const winkGif = await animeService.exec('wink')

        const e = new MessageEmbed()
            .setColor('RANDOM')
            .setImage(winkGif.url)
        
        if (!member || member.user.id === message.author.id) e.setDescription(`**${message.author.tag}** winked!`)
        else e.setDescription(`**${message.author.tag}** winks at **${member.user.tag}!**`)

        return message.channel.send({ embeds: [e] })
    }
}