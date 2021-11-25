import { Message, MessageEmbed, MessageReaction, User } from 'discord.js'
import moment from 'moment'
import ms from 'ms'

import Giveaways from '../models/Giveaways'
import { Colours } from '../util/Colours'

export default {
    async end(msg: Message) {
        await msg.fetch(true)
        const noOfWinners = await Giveaways.find().then(r => r.find(g => g.message === msg.id)?.winners).catch(void 0)

        Giveaways.deleteOne({ message: msg.id })

        const reaction: MessageReaction = await msg.reactions?.cache.filter(r => r.emoji.name === '🎉').first().fetch()
        await reaction.users.fetch()

        const embed: MessageEmbed = msg.embeds[0]
        embed.setFooter('Giveaway ended')
        embed.setColor(Colours.Red)

        if (noOfWinners === 1) {
            const winner: User = reaction.users.cache.filter(w => !w.bot).random()

            embed.addField('Winner', winner ? `${winner.tag}` : 'No one has won the giveaway :pensive:')
            msg.edit({ embeds: [embed] })
        } else {
            let winners: User[] = reaction.users.cache?.filter(w => !w.bot).random(noOfWinners)

            embed.addField('Winners', winners ? `${winners.map(u => u.tag).join(', ')}` : 'No one has won the giveaway :pensive:')
            msg.edit({ embeds: [embed] })
        }
    },

    async edit(msg: Message, { type, newValue }: {type: string, newValue: any }) {
        const giveaway = await Giveaways.findOne({ message: msg.id })

        const editHandler = {
            'prize' : async () => {
                if (typeof newValue === 'string' || newValue.length < 4) return false

                giveaway.reward = newValue

                const e = new MessageEmbed()
                    .setAuthor(`Giveaway | ${newValue}`)
                    .setColor(Colours.Spring)
                    .setDescription(`React with 🎉 to enter!\nGiveaway is hosted by ${msg.author}!`)
                    .setFooter(`Ends at • ${moment(giveaway.end).utcOffset(1).format('YYYY/M/DD HH:mm:ss')} ${giveaway.winners > 1 ? ' | ' + giveaway.winners + ' winners' : ''}`)

                await msg.fetch(true).catch(void 0)
                await msg.edit({ embeds: [e] })
                await giveaway.save()
                return true
            },
            'time' : async () => {
                if (!Number(ms(newValue))) return false

                giveaway.end = Date.now() + Number(ms(newValue))

                const e = new MessageEmbed()
                    .setAuthor(`Giveaway | ${giveaway.reward}`)
                    .setColor(Colours.Spring)
                    .setDescription(`React with 🎉 to enter!\nGiveaway is hosted by ${msg.author}!`)
                    .setFooter(`Ends at • ${moment(giveaway.end).utcOffset(1).format('YYYY/M/DD HH:mm:ss')} ${giveaway.winners > 1 ? ' | ' + giveaway.winners + ' winners' : ''}`)

                await msg.fetch(true).catch(void 0)
                await msg.edit({ embeds: [e] })
                await giveaway.save()
                return true
            },
            'winners': async () => {
                if (typeof newValue !== 'number' || newValue > 50 || newValue < 1) return false

                giveaway.winners = newValue

                const e = new MessageEmbed()
                    .setAuthor(`Giveaway | ${giveaway.reward}`)
                    .setColor(Colours.Spring)
                    .setDescription(`React with 🎉 to enter!\nGiveaway is hosted by ${msg.author}!`)
                    .setFooter(`Ends at • ${moment(giveaway.end).utcOffset(1).format('YYYY/M/DD HH:mm:ss')} ${giveaway.winners > 1 ? ' | ' + giveaway.winners + ' winners' : ''}`)

                await msg.fetch(true).catch(void 0)
                await msg.edit({ embeds: [e] })
                await giveaway.save()
                return true
            }
        }

        return editHandler[type].call()
    }
}