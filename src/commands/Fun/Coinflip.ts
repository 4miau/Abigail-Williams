import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

export default class Coinflip extends Command {
    public constructor() {
        super('coinflip', {
            aliases: ['coinflip'],
            category: 'Fun',
            description: {
                content: 'Flip a coin, will it be heads or tails?',
                usage: 'conflip [heads/tails]',
                examples: ['coinflip [heads/tails]'],
            },
            ratelimit: 3,
            args: [
                {
                    id: 'HoT', //Heads or Tails
                    type: (_: Message, str: string) => {
                        if (str) {
                            if (str.toLowerCase() === 'heads') return str
                            if (str.toLowerCase() === 'tails') return str
                        }
                        return null
                    }
                }
            ]
        })
    }

    public exec(message: Message, {HoT}: {HoT: string}): Promise<Message> {
        if (!HoT) return message.util!.send('You must provide at least heads or tails.')

        const headsortails = ['heads', 'tails']
        const winner = headsortails[Math.floor(Math.random() * 2)]

        return winner === HoT ? message.util!.send(`You have won! It landed on ${winner}`) : message.util!.send(`Unlucky! The coin landed on ${winner}.`)
    }
}