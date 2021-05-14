import { Command } from 'discord-akairo'
import { Message, GuildMember } from 'discord.js'
import ms from 'ms'

import { Repository } from 'typeorm'

import { Bans } from '../../models/Bans'
import { maxBanDays, minBanDays } from '../../util/Constants'

export default class Ban extends Command {
    public constructor() {
        super('ban', {
            aliases: ['ban', 'bean'],
            category: 'Moderation',
            description: {
                    content: 'Bans a user from the server',
                    usage: 'ban [@user] <days> <reason>',
                    examples: ['ban @user', 'ban @user 3d for being rude to staff']
            },
            channel: 'guild',
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
                        if (str) {
                            if (Number(ms(str)) < minBanDays && Number(ms(str)) > maxBanDays) {
                                return Number(ms(str))
                            }
                        }
                        return 0
                    },
                    match: 'phrase'
                },
                {
                    id: 'reason',
                    type: 'string',
                    match: 'rest',
                    default: 'No reason specified'
                }
            ]
        })
    }

    public async exec(message: Message, {member, days, reason}: {member: GuildMember, days: number, reason: string}): Promise<any> {
        const banRepo: Repository<Bans> = this.client.db.getRepository(Bans)

        if (member!.bannable) {
            await member.ban({days: days? days : Infinity, reason: reason})

            await banRepo.insert({
                guild: message.guild.id,
                user: member.user.id,
                moderator: message.author.id,
                duration: days ? 0 : days,
                reason: reason ? reason : 'No reason specified'
            })

            return message.util!.send(`${member.user.id} has successfully been banned from the server.`)
        } else {
            message.util!.reply('I am unable to ban that user.')
        }
    }
}