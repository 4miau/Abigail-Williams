import { Command } from 'discord-akairo'
import { Message, MessageEmbed, TextChannel } from 'discord.js'

import { Colours } from '../../util/Colours'

export default class Suggest extends Command {
    public constructor() {
        super('suggest', {
            aliases: ['suggest'],
            category: 'General',
            description: {
                content: 'Make a suggestion for a server.',
                usage: 'suggest [suggestion]',
                examples: ['suggest add new roles'],
            },
            channel: 'guild',
            ratelimit: 3,
            args: [
                {
                    id: 'suggestion',
                    type: 'string',
                    match: 'rest'
                }
            ]
        })
    }

    public async exec(message: Message, {suggestion}: {suggestion: string}): Promise<Message> {
        if (!suggestion) return message.channel.send('You need to at least provide a suggestion for me to send.')

        const suggestionChannel = message.guild.channels.resolve(this.client.settings.get(message.guild, 'suggest-channel', '')) as TextChannel
        if (!suggestionChannel) return message.channel.send('This current server does not have a suggestion channel, set a suggestion channel first.')

        const e = new MessageEmbed()
            .setAuthor(`${message.guild.name} | ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true, format: 'png' }))
            .setDescription(suggestion)
            .setColor(Colours.SkyBlue)
            .setFooter(`User ID: ${message.author.id}`)
        
        await suggestionChannel.send({ embeds: [e] })
            .then(async msg => {
                await msg.react('<a:neontickgreen:845476895163416657>')
                await msg.react('<a:neontickyellow:845476895449546762>')
                await msg.react('<a:neontickred:845476895134842904>')
                message.attachments.size > 0 ? msg.edit({ files: message.attachments.map(a => a) }) : void 0
            })

        await message.channel.send('I have posted the suggestion.').then(msg => setTimeout(() => { msg.delete() }, 5000))
    }
}