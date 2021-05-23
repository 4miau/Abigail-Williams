import { Argument, Command } from 'discord-akairo'
import { Message, GuildMember } from 'discord.js'
import moment, { now } from 'moment'
import ms from 'ms'

import { Repository } from 'typeorm'

import { Case as Case } from '../../models/Case'
import ModUtil from '../../util/ModUtil'

export default class Ban extends Command {
    public constructor() {
        super('ban', {
            aliases: ['ban', 'bean'],
            category: 'Moderation',
            description: {
                    content: 'Bans a user from the server. Using the -s flag will prevent the bot from asking for confirmation on ban.',
                    usage: 'ban [@user] <days> <reason>',
                    examples: ['ban @user', 'ban @user 3d for being rude to staff'],
                    flags: ['-s']
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
                    id: 'reason',
                    type: 'string',
                    match: 'rest',
                    default: 'No reason specified',
                    unordered: true
                },
                {
                    id: 'skip',
                    match: 'flag',
                    flag: ['-skip', '-s'],
                    unordered: true
                }
            ]
        })
    }

    public async exec(message: Message, {member, reason, skip}: {member: GuildMember, days: number, reason: string, skip: boolean}): Promise<any> {        
        const caseRepo: Repository<Case> = this.client.db.getRepository(Case)
        const totalCases: number = this.client.settings.get(message.guild, 'totalCases', 0) + 1

        if (!member!.bannable) return message.util!.send('I do not have the permissions to ban this user.')

        if (skip) {
            await member.ban({days: 7, reason: reason})
            this.client.settings.set(message.guild, 'totalCases', totalCases)
        } else {
            message.channel.send('Are you sure that you would like me to ban that user?')

            const reply = (await message.channel.awaitMessages((msg: Message) => msg.author.id === message.author.id, { 
                'max': 1, 
                'time': 30000 
            })).first().content

            if (reply && (/^y(?:e(?:a|s)?)?$/i).test(reply)) {
                await member.ban({days: 7, reason: reason})
                this.client.settings.set(message.guild, 'totalCases', totalCases)
            } else {
                return message.util!.send('Moderator has not confirmed the ban, the command has now been cancelled.')
            } 
        }

        await message.channel.send('Banning user...')

        const newCase = new Case()
        
        newCase.guildID = message.guild.id
        newCase.messageID = message.id
        newCase.caseID = totalCases

        newCase.action = ModUtil.CONSTANTS.ACTIONS.BAN
        newCase.reason = reason
        
        newCase.targetID = member.user.id
        newCase.targetTag = member.user.tag
        newCase.modID = message.author.id
        newCase.modTag = message.author.tag

        await caseRepo.save(newCase)
        
        this.client.logger.log('CAUTION', `New case has been saved. ${newCase.targetTag} (${newCase.targetID})`)

        return message.util!.send(`${member.user.id} has successfully been banned from the server.`)
        
    }
}

/*
                    type: (_: Message, str: string) => {
                        if (str) {
                            if (Number(ms(str)) < minBanDays && Number(ms(str)) > maxBanDays) {
                                return Number(ms(str))
                            }
                        }
                        return 0
                    },
*/