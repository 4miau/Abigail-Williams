import { Command } from 'discord-akairo'
import { Message, MessageEmbed, TextChannel } from 'discord.js'

import { Colours } from '../../util/Colours'
import { feedbackChannel } from '../../util/PersonalConstants'

export default class Feedback extends Command {
    public constructor() {
        super('feedback', {
            aliases: ['feedback'],
            category: 'Utility',
            description: {
                content: 'Send feedback/suggestions for the bot directly to the bot owner.',
                usage: 'feedback [feedback/suggestion]',
                examples: ['feedback add music commands'],
            },
            ratelimit: 3,
            args: [
                {
                    id: 'feedback',
                    type: 'string',
                    match: 'rest'
                }
            ]
        })
    }

    public exec(message: Message, {feedback}: {feedback: string}): Promise<Message> {
        if (!feedback) { return message.util!.send('Please provide some feedback to help me in future updates!') }

        const embed = new MessageEmbed()
            .setAuthor(`New feedback submission by ${message.author.tag} (${message.author.id})`)
            .setDescription(`**Feedback:**\n${feedback}`)
            .setColor(Colours.SteelBlue)
            .setFooter('Abigail Williams')

        const fbChannel = this.client.channels.cache.get(feedbackChannel) as TextChannel
        fbChannel.send(embed)

        return message.util!.send(`
        Feedback has been sent to the bot owner, thank you for contributing if your submission was not a troll.
        PS: Troll submissions will get you blacklisted from the command.
        `)
    }
}