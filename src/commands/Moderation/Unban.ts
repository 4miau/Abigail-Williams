import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

export default class Unban extends Command {
    public constructor() {
        super('unban', {
            aliases: ['unban', 'unbean'],
            category: 'Moderation',
            description: [
                {
                    content: 'Unbans a currently banned user',
                    usage: 'unban [userID] <reason>',
                    examples: ['unban 1337 was a mistake']
                }
            ],
            userPermissions: ['BAN_MEMBERS'],
            clientPermissions: ['SEND_MESSAGES', 'BAN_MEMBERS'],
            ratelimit: 3,
            args: [
                {
                    id: 'member',
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

    public async exec(message: Message, {member, reason}: {member: string, reason: string}): Promise<Message> {
        //TODO: Unban through cache
        
        //const user: User = this.client.util.resolveUser(member, message.guild.members.cache.)
        if (member) {
            try {
                await message.guild.members.unban(member, reason ? reason : 'No reason specified')
                return message.util!.reply(`User has been unbanned from the server. Reason: ${reason ? reason : 'No reason specified'}`)
            } catch (err) {
                return message.util!.send('Unable to unban that user...')
            }
        } else {
            return message.util!.send('Please provide a user ID to unban.')
        }
    }
}