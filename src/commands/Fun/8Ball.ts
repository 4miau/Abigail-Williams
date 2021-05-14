import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

import { eightBallReplies } from '../../util/Constants'
import { getRandomInt } from '../../util/Functions'

export default class EightBall extends Command {
    public constructor() {
        super('8ball', {
            aliases: ['8ball', '8b', 'eightball'],
            category: 'Fun',
            description: {
                    content: 'Ask the 8ball a question and see what answer you get back!',
                    usage: '8ball [question]',
                    examples: ['8ball Do I have friends?']
            },
            clientPermissions: ['SEND_MESSAGES'],
            ratelimit: 5,
            args: [
                {
                    id: 'question',
                    type: 'string'
                }
            ]
        })
    }

    public exec(message: Message, {question}: {question: string}): Promise<Message> {
        return message.util!.send(question ? ':8ball: ' + eightBallReplies[getRandomInt(eightBallReplies.length)] : 'What are you asking the 8ball?')
    }
}