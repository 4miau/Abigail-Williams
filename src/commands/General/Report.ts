import { Command } from 'discord-akairo'
import { Message, MessageEmbed } from 'discord.js'

import { Colours } from '../../util/Colours'

export default class Report extends Command {
    public constructor() {
        super('report', {
            aliases: ['report'],
            category: 'General',
            description: {
                content: 'Send a server report for the Bunny Cartel. (Can also be feedback)',
                usage: 'report [content]',
                examples: ['report a false ban was made'],
            },
            channel: 'guild',
            ratelimit: 3,
            args: [
                {
                    id: 'content',
                    type: 'string',
                    match: 'rest'
                }
            ]
        })
    }

    //@ts-ignore
    userPermissions(message: Message) {
        if (message.guild !== this.client.abbyHomeServer) return 'Not in home server.'
        return null
    }

    public async exec(message: Message, {content}: {content: string}): Promise<Message> {
        message.delete()
        if (!content || content.length < 10) {
            return message.util.send('Please provide a report (needs to be above 10 characters to be valid.')
                .then(msg => {
                    setTimeout(() => { msg.delete() }, 5000)
                    return msg
                })
        }

        const e = new MessageEmbed()
            .setAuthor(`${message.guild.name} | ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true, format: 'png' }))
            .setTitle('New report submitted')
            .setDescription(content)
            .setColor(Colours.HotPink)
            .setFooter(`User ID: ${message.author.id}`)

        this.client.abbyReport.send({ embeds: [e] })
        
        await message.util.send('Report sent successfully.').then(msg => setTimeout(() => { msg.delete() }, 5000))
    }
}