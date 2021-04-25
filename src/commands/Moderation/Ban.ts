import { Command } from 'discord-akairo'
import { Message, GuildMember } from 'discord.js'
import ms from 'ms'

export default class Ban extends Command {
    public constructor() {
        super('ban', {
            aliases: ['ban', 'bean'],
            category: 'Moderation',
            description: [
                {
                    content: 'Bans a user from the server',
                    usage: 'ban [@user] <days> <reason>',
                    examples: ['ban @user', 'ban @user 3d for being rude to staff']
                }
            ],
            userPermissions: ['BAN_MEMBERS'],
            clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'SEND_MESSAGES'],
            ratelimit: 3,
            args: [
                {
                    id: 'member',
                    type: 'member',
                    prompt: {
                        start: (msg: Message) => `${msg.author}, please provide a member to ban...`,
                        retry: (msg: Message) => `${msg.author}, please provide a valid member to ban...`,
                        cancel: () => 'The command has now been cancelled.'
                    }
                },
                {
                    id: 'days',
                    type: (_: Message, str: string) => {
                        if (Number(ms(str)) < 2.6e9 && Number(ms(str)) > 8.64e7) {
                            return Number(ms(str))
                        }
                        return 0
                    },
                    match: 'phrase',
                    default: 0
                },
                {
                    id: 'reason',
                    type: 'string',
                    'match': 'rest',
                    'default': 'No reason specified'
                }
            ]
        })
    }

    public exec(message: Message, {member, days, reason}: {member: GuildMember, days: number, reason: string}): Promise<any> {
        if (member!.bannable) {
            member.ban({days: days? days : Infinity, reason: reason})
            return message.util!.send(`${member.user.id} has successfully been banned from the server.`)
        } else {
            message.util!.reply('I am unable to ban that user.')
        }
    }
}