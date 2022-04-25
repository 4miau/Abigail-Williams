import { Command } from 'discord-akairo'
import { GuildMember, Message, MessageEmbed } from 'discord.js'

export default class HoldHand extends Command {
    public constructor() {
        super('holdhand', {
            aliases: ['handhold', 'holdhand', 'holdhands'],
            category: 'Action',
            description: {
                content: 'Holds hands with a user (:flushed:)',
                usage: 'holdhands [@user]',
                examples: ['holdhands @user'],
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
        if (!member) return message.channel.send('Provide a member to hold hands with... that\'s lewd!')
        if (member.user.id === message.author.id) return message.channel.send('Holding hands with yourself... are you that lonely?')
        
        const animeService = this.client.serviceHandler.modules.get('getanimesfw')
        const handHoldGif = await animeService.exec('handhold')

        const e = new MessageEmbed()
            .setDescription(`**${message.author.tag}** is...holding hands with **${member.user.tag}!** :flushed:`)
            .setColor('RANDOM')
            .setImage(handHoldGif.url)

        return message.channel.send({ embeds: [e] })
    }
}