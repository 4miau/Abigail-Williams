import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

import { bulletsMin, bulletsMax, bulletsTotal, emojiList, deadList, liveList } from '../../utils/Constants'
import { getRandomInt } from '../../utils/Functions'

export default class RussianRoulette extends Command {
    public constructor() {
        super('rr', {
            aliases: ['rr', 'russianroulette', 'rroulette'],
            category: 'Fun',
            description: [
                {
                    content: 'Plays russian roulette with a supplied amount of bullets',
                    usage: 'rr [numberOfBullets]',
                    examples: ['rr 3']
                }
            ],
            ratelimit: 3,
            args: [
                {
                    id: 'bullets',
                    type: 'number',
                    default: 1
                }
            ]
        })
    }

    public async exec(message: Message, {bullets}: {bullets: number}): Promise<Message> {
        if (bullets < bulletsMin) return message.util!.send('You coward, you need at least 1 bullet in the chamber!')
        if (bullets > bulletsMax) return message.util!.send('Woah, you really must be trying to get yourself killed.')

        const dead: boolean = (Math.floor(Math.random() * bulletsTotal) < bullets)

        return await (message.util!.send(`You load ${bullets === 1 ? 'a bullet' : bullets + ' bullets'} into the revolver, give it a spin, and place it against your head.`)
                .then(msg => { return msg.channel.send(`${emojiList[getRandomInt(emojiList.length)]} :gun:`)})
                .then(msg => {
                    const lastMsg = message.util!.lastResponse.content

                    return message.util!.edit(setTimeout(() => {
                        if (dead) {
                            message.util!.edit(lastMsg + `\n***BOOM***, ${deadList[getRandomInt(deadList.length)]}`)
                            msg.edit(':boom::gun:')
                        } else {
                            message.util!.edit(lastMsg + `\n***Click***, ${liveList[getRandomInt(liveList.length)]}`)
                            msg.edit(':relieved::gun:')
                        }
                    }, 4000))
                })
        )

    }
}