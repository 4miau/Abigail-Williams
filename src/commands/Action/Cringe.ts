import { Command } from 'discord-akairo'
import { GuildMember, Message, MessageEmbed } from 'discord.js'

export default class Cringe extends Command {
    public constructor() {
        super('cringe', {
            aliases: ['cringe', 'cringes'],
            category: 'Action',
            description: {
                content: 'Cringes (possibly because of a user)',
                usage: 'cringe <@user>',
                examples: ['cringe', 'cringe @user'],
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
        const cringeGif = await animeService.exec('cringe')
        
        const e = new MessageEmbed()
            .setColor('RANDOM')
            .setImage(cringeGif.url)

        if (!member) e.setDescription(`**${message.author.tag}** is cringing, oh man.`)
        else if (member.user.id === message.author.id) e.setDescription(`**${message.author.tag}** is cringing at themselves, oh dear.`)
        else e.setDescription(`**${message.author.tag}** is cringing because of **${member.user.tag}**.`)

        return message.channel.send({ embeds: [e] })
    }
}