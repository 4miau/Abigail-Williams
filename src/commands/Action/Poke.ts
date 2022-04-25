import { Command } from 'discord-akairo'
import { GuildMember, Message, MessageEmbed } from 'discord.js'

export default class pokeGif extends Command {
    public constructor() {
        super('poke', {
            aliases: ['poke', 'pokes'],
            category: 'Action',
            description: {
                content: 'Just pokes a user... that\'s about it?',
                usage: 'poke [@user]',
                examples: ['poke @user'],
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
        if (!member) return message.channel.send('Provide a member to poke.')
        if (member.user.id === message.author.id) return message.channel.send('Poking yourself is a bit strange..')
        
        const animeService = this.client.serviceHandler.modules.get('getanimesfw')
        const pokeGif = await animeService.exec('poke')
        
        const e = new MessageEmbed()
            .setDescription(`**${message.author.tag}** poked **${member.user.tag}.**`)
            .setColor('RANDOM')
            .setImage(pokeGif.url)

        return message.channel.send({ embeds: [e] })
    }
}