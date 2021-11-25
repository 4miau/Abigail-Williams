import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

import { bulletsMin, bulletsMax, bulletsTotal, emojiList, deadList, liveList } from '../../util/Constants'

export default class RussianRoulette extends Command {
    public constructor() {
        super('rr', {
            aliases: ['rr', 'russianroulette', 'rroulette'],
            category: 'Fun',
            description: {
                    content: 'Plays russian roulette with a supplied amount of bullets',
                    usage: 'rr [numberOfBullets]',
                    examples: ['rr 3']
            },
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
        if (bullets < bulletsMin) return message.channel.send('You coward, you need at least 1 bullet in the chamber!')
        else if (bullets > bulletsMax) return message.channel.send('Woah, you really must be trying to get yourself killed.')

        const dead: boolean = (Math.floor(Math.random() * bulletsTotal) < bullets)
        
        const reply = await message.channel.send(`You load ${bullets === 1 ? 'a bullet' : bullets + ' bullets'} into the revolver, give it a spin, and place it against your head.`)

        return message.channel.send(`${emojiList.arrayRandom()} :gun:`)
            .then(msg => {
                const lastContent = message.util.lastResponse.content
                setTimeout(() => {
                    if (dead) {
                        reply.edit(lastContent + `\n***BOOM***, ${deadList.arrayRandom()}`)
                        msg.edit(':boom::gun:')
                    }
                    else {
                        reply.edit(lastContent + `\n***Click***, ${liveList.arrayRandom()}`)
                        msg.edit(':relieved::gun:')
                    }
                }, 4000)

                return msg
            })
    }
}