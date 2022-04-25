import { Command } from 'discord-akairo'
import { GuildMember, Message, MessageEmbed } from 'discord.js'

export default class Kill extends Command {
    public constructor() {
        super('kill', {
            aliases: ['kill', 'kills'],
            category: 'Action',
            description: {
                content: 'Kills a user',
                usage: 'kill [@user]',
                examples: ['kill @user'],
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
        if (!member) return message.channel.send('Please provide a member to kill.')
        if (member.user.id === message.author.id) return message.channel.send('Don\'t try to take the easy way out of this...')
        
        const animeService = this.client.serviceHandler.modules.get('getanimesfw')
        const killGif = await animeService.exec('kill')

        const e = new MessageEmbed()
            .setDescription(`**${message.author.tag}** killed **${member.user.tag}!** There's been a murder!`)
            .setColor('RANDOM')
            .setImage(killGif.url)
    
        return message.channel.send({ embeds: [e] })
    }
}