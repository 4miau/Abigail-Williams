import { Command } from 'discord-akairo'
import { GuildMember, Message } from 'discord.js'
import { Repository } from 'typeorm'

import { Case } from '../../models/Case'
import ModUtil from '../../util/ModUtil'

export default class Softban extends Command {
    public constructor() {
        super('softban', {
            aliases: ['softban'],
            category: 'Moderation',
            description: {
                content: 'Bans a user and immediately unbans them to clear message history.',
                usage: 'softban [@user] [reason]',
                examples: ['softban user being toxic'],
            },
            userPermissions: ['BAN_MEMBERS'],
            ratelimit: 3,
            args: [
                {
                    id: 'member',
                    type: 'member'
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

        if (!member) return message.util!.send('Yo must provide a member to softban...')
        if (!member!.bannable) return message.util!.send('I do not have the permissions to ban this user.')

        await message.channel.send('Softbanning user...')

        const newCase = new Case()
        
        newCase.guildID = message.guild.id
        newCase.messageID = message.id
        newCase.caseID = totalCases

        newCase.action = ModUtil.CONSTANTS.ACTIONS.SOFTBAN
        newCase.reason = reason
        
        newCase.targetID = member.user.id
        newCase.targetTag = member.user.tag
        newCase.modID = message.author.id
        newCase.modTag = message.author.tag

        await caseRepo.save(newCase)
        this.client.settings.set(message.guild, 'totalCases', totalCases)

        await member.ban({ days: 7, reason: reason }).then(bu => message.guild.members.unban(bu))
        return message.util!.send(`${member.user.tag} has been softbanned.`)

    }
}

/*
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

        if (!member) return message.util!.send('Yo must provide a member.')

        try {
            await member.ban({ 'reason': reason ? reason : 'No reason specified'})
                .then(bu => message.guild.members.unban(bu))
            return message.util!.send(`${member.user.tag} has been softbanned.`)
        } catch (err) {  return message.util!.send('I do not have permissions to softban this user.') }
*/