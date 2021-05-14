import { Message, MessageEmbed, MessageReaction, User } from "discord.js";
import { Repository } from "typeorm";
import { Giveaways } from "../models/Giveaways";
import { Colours } from "../util/Colours";

export default {
    async end(giveawayRepo: Repository<Giveaways>, msg: Message) {
        await msg.fetch(true)
        const noOfWinners = await giveawayRepo.find()
            .then(r => r.find(g => g.message === msg.id).winners)

        giveawayRepo.delete({
            message: msg.id
        })

        const reaction: MessageReaction = await msg.reactions.cache.filter(r => r.emoji.name === '🎉').first().fetch()
        await reaction.users.fetch()

        const embed: MessageEmbed = msg.embeds[0]
        embed.setFooter('Giveaway ended')
        embed.setColor(Colours.Red)

        if (noOfWinners === 1) {
            const winner: User = reaction.users.cache.filter(w => !w.bot).random()

            embed.addField('Winner', winner ? `${winner.tag}` : 'No one has won the giveaway :pensive:')
            msg.edit(embed)
        } else {
            let winners: User[] = reaction.users.cache.filter(w => !w.bot).random(noOfWinners)

            embed.addField('Winners', winners ? `${winners.map(u => u.tag).join(', ')}` : 'No one has won the giveaway :pensive:')
            msg.edit(embed)
        }
    }
}