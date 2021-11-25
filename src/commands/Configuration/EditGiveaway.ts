import { Argument, Command } from 'discord-akairo'
import { Message } from 'discord.js'

import Giveaways from '../../models/Giveaways'
import GiveawayManager from '../../structures/GiveawayManager'

export default class EditGiveaway extends Command {
    public constructor() {
        super('editgiveaway', {
            aliases: ['editgiveaway'],
            category: 'Configuration',
            description: {
                content: 'Manage an existing giveaway.',
                usage: 'editgiveaway [messageID] [prize/time/winners] [value]',
                examples: ['editgiveaway 1234567890 prize Nitro!', 'editgiveaway 1234567890 time 3d', 'editgiveaway 1234567890 winners 3'],
                flags: ['prize', 'time', 'winners']
            },
            channel: 'guild',
            ratelimit: 3,
            args: [
                {
                    id: 'msgID',
                    type: 'message'
                },
                {
                    id: 'type',
                    type: (_: Message, str: string) => {
                        if (!str) return null
                        if (str === 'prize' || str === 'time' || str === 'winners') return str
                    },
                    match: 'phrase'
                },
                {
                    id: 'newValue',
                    type: Argument.union('number', 'string', 'time'),
                    match: 'rest'
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

    public async exec(message: Message, {msgID, type, newValue}: {msgID: Message, type: string, newValue: any}): Promise<Message> {
        if (!msgID) return message.channel.send('Provide a message with a giveaway so I can edit it...')
        if (!type) return message.channel.send('Well uh, how will I know what to change about the giveaway, huh?')
        if (!newValue) return message.channel.send('Uhm, no new value for the type? That\'s unhelpful.')
        
        try {
            const giveaway = await Giveaways.findOne({ message: msgID.id })
            if (giveaway) {
                this.client.queue.add(GiveawayManager.edit(msgID, { type, newValue }))
                message.delete()
                return message.channel.send('Giveaway edited successfully.')
            }
            else throw new Error('Unable to find the giveaway.')
        } catch {
            return message.channel.send('This message does not have a giveaway attached to it...')
        }
    }
}