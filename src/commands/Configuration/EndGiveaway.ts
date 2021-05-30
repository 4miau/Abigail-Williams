import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

import GiveawayManager from '../../structures/GiveawayManager'
import { Giveaways } from '../../models/Giveaways'

export default class EndGiveaway extends Command {
    public constructor() {
        super('endgiveaway', {
            aliases: ['endgiveaway'],
            category: 'General',
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
        const modRole: string = this.client.settings.get(message.guild, 'modRole', '')
        const hasStaffRole = message.member.hasPermission('MANAGE_GUILD', { checkAdmin: true, checkOwner: true}) || message.member.roles.cache.has(modRole)

        if (!hasStaffRole) return 'Moderator'
        return null
    }

    public async exec(message: Message, {msgID}: {msgID: Message}): Promise<Message> {
        if (!msgID) return message.util!.send('Please provide a valid message ID to end the giveaway of.')

        const giveawayRepo = this.client.db.getRepository(Giveaways)

        try {
            const giveaway = await giveawayRepo.find().then(gArr => gArr.find(g => g.message === msgID.id).message)
            if (giveaway) this.client.queue.add(GiveawayManager.end(giveawayRepo, msgID))
            message.delete()
            return message.util!.send('Giveaway has been ended successfully.')
        } catch (err) {
            return message.util!.send('There is no giveaway for this message.')
        }
    }
}