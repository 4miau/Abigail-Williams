import { Command } from 'discord-akairo'
import { GuildMember, Message, MessageEmbed } from 'discord.js'

export default class Lick extends Command {
    public constructor() {
        super('lick', {
            aliases: ['lick', 'licks'],
            category: 'Action',
            description: {
                content: 'Licks a user?',
                usage: 'lick [@user]',
                examples: ['lick @user'],
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
        if (!member) return message.channel.send('Provide a member to lick. Weirdo.')
        if (member.user.id === message.author.id) return message.channel.send('You can\'t lick yourself... that\'s just weird..')
        
        const animeService = this.client.serviceHandler.modules.get('getanimesfw')
        const lickGif = await animeService.exec('lick')

        const e = new MessageEmbed()
            .setDescription(`**${message.author.tag}** is licking **${member.user.tag}!** Eh...`)
            .setColor('RANDOM')
            .setImage(lickGif.url)

        return message.channel.send({ embeds: [e] })
    }
}