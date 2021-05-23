import { Command } from 'discord-akairo'
import { Message, GuildMember } from 'discord.js'
import { Repository } from 'typeorm'

import { Case } from '../../models/Case'
import ModUtil from '../../util/ModUtil'

export default class Kick extends Command {
    public constructor() {
        super('kick', {
            aliases: ['kick'],
            category: 'Moderation',
            description: {
                    content: 'Kicks a user from the server.',
                    usage: 'kick [@user] <reason>',
                    examples: ['kick @user', 'kick @user swearing too much.']
            },
            channel: 'guild',
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
                    match: 'rest',
                    default: 'No reason specified.'
                }
            ]
        })
    }

    public async exec(message: Message, {member, reason}: {member: GuildMember, reason: string}): Promise<Message> {
        const caseRepo: Repository<Case> = this.client.db.getRepository(Case)
        const totalCases: number = this.client.settings.get(message.guild, 'totalCases', 0) + 1

        if (!member.kickable) return message.util!.send('I am unable to kick that user.')

        await member.kick(reason)
        this.client.settings.set(message.guild, 'totalCases', totalCases)

        const newCase = new Case()

        newCase.guildID = message.guild.id
        newCase.messageID = message.id
        newCase.caseID = totalCases

        newCase.action = ModUtil.CONSTANTS.ACTIONS.KICK
        newCase.reason = reason
        
        newCase.targetID = member.user.id
        newCase.targetTag = member.user.tag
        newCase.modID = message.author.id
        newCase.modTag = message.author.tag

        caseRepo.save(newCase)

        return (await message.util!.send(`${member.user.tag} (${member.user.id}) has been kicked from the server successfully.`)).delete({ 'timeout': 5000 })
    }
}