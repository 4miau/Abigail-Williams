import { Command } from 'discord-akairo'
import { Message, GuildMember } from 'discord.js'

export default class Kick extends Command {
    public constructor() {
        super('kick', {
            aliases: ['kick'],
            category: 'Moderation',
            description: [
                {
                    content: 'Kicks a user from the server.',
                    usage: ['kick [@user] <reason>'],
                    examples: ['kick @user', 'kick @user swearing too much.']
                }
            ],
            userPermissions: ['KICK_MEMBERS'],
            clientPermissions: ['SEND_MESSAGES', 'KICK_MEMBERS'],
            ratelimit: 3,
            args: [
                {
                    id: 'member',
                    type: 'member',
                    prompt: {
                        start: (msg: Message) => `${msg.author}, please provide a member to kick...`,
                        retry: (msg: Message) => `${msg.author}, please provide a valid member to kick...`,
                        cancel: () => `The command has now been cancelled.`
                    }
                },
                {
                    id: 'reason',
                    type: 'string',
                    match: 'rest'
                }
            ]
        })
    }

    public async exec(message: Message, {member, reason}: {member: GuildMember, reason: string}): Promise<Message> {
        if (member.kickable) {
            await member.kick(reason ? reason : 'No reason specified')
            return message.util!.send(`${member} has been kicked, ${reason ? 'Reason: ' + reason : ''}`)
        } 
        else return message.util!.reply('I am unable to kick that user.')
    }
}