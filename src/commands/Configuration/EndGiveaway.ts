import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

import GiveawayManager from '../../structures/GiveawayManager'
import Giveaways from '../../models/Giveaway'

export default class EndGiveaway extends Command {
    public constructor() {
        super('endgiveaway', {
            aliases: ['endgiveaway'],
            category: 'Configuration',
            description: {
                content: 'Ends a currently existing giveaway.',
                usage: 'giveawayend [messageID]',
                examples: [''],
            },
            channel: 'guild',
            ratelimit: 3,
            args: [
                {
                    id: 'msgID',
                    type: 'message'
                }
            ]
        })
    }

    //@ts-ignore
    userPermissions(message: Message) {
        const modRole = this.client.settings.get(message.guild, 'modRole', '')
        const hasStaffRole = message.member.permissions.has('MANAGE_GUILD', true) || message.member.roles.cache.has(modRole)

        if (!hasStaffRole) return 'Moderator'
        return null
    }

    public async exec(message: Message, {msgID}: {msgID: Message}): Promise<Message> {
        if (!msgID) return message.channel.send('Please provide a valid message ID to end the giveaway of.')

        try {
            const giveaway = await Giveaways.find().then(gArr => gArr.find(g => g.message === msgID.id).message)
            if (giveaway) this.client.queue.add(GiveawayManager.end(msgID))
            message.delete()
            return message.channel.send('Giveaway has been ended successfully.')
        } catch (err) {
            return message.channel.send('There is no giveaway for this message.')
        }
    }
}