import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

export default class Unban extends Command {
    public constructor() {
        super('unban', {
            aliases: ['unban', 'unbean'],
            category: 'Moderation',
            description: {
                    content: 'Unbans a currently banned user',
                    usage: 'unban [userID] <reason>',
                    examples: ['unban 1337 was a mistake']
            },
            channel: 'guild',
            userPermissions: ['BAN_MEMBERS'],
            clientPermissions: ['SEND_MESSAGES', 'BAN_MEMBERS'],
            ratelimit: 3,
            args: [
                {
                    id: 'user',
                    type: 'string',
                    match: 'phrase'
                },
                {
                    id: 'reason',
                    type: 'string',
                    match: 'rest'
                }
            ]
        })
    }

    public async exec(message: Message, {user, reason}: {user: string, reason: string}): Promise<Message> {
        if (!user) return message.util!.send('Okay, so who am I meant to unban then? Provide a user please.')

        await message.guild.fetchBans()
            .then(buCol => buCol.find(bu => bu.user.username === user || bu.user.id === user))
            .then(bu => {
                message.guild.members.unban(bu.user, reason ? reason : 'No reason specified')
                message.util!.send('User has been unbanned from the server.')
            })
            .catch(() => message.util!.send('Unable to find this user, please try again.'))
    }
}