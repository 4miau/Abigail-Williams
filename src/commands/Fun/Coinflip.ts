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
                        if (str) if (str === 'tails' || str === 'heads') return str
                        return null
                    }
                }
            ]
        })
    }

    public exec(message: Message, {HoT}: {HoT: string}): Promise<Message> {
        if (!HoT) return message.util!.send('You must either choose heads or tails to flip the coin.')

        const choices = ['heads', 'tails']

        const win = choices[Math.floor(Math.random() * 2)]

        if (win === HoT) return message.util!.send(`The coin landed on ${HoT.toLowerCase()}. You win.`)
        else return message.util!.send(`Unfortunately the coin landed on ${win === 'tails' ? 'tails' : 'heads'}. You lose.`)
    }
}