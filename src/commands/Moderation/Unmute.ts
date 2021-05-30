import { Command } from 'discord-akairo'
import { Message, GuildMember } from 'discord.js'
import { Repository } from 'typeorm'

import { Case } from '../../models/Case'
import ModUtil from '../../util/ModUtil'

export default class Unmute extends Command {
    public constructor() {
        super('unmute', {
            aliases: ['unmute', 'unsilence', 'unshadowrealm'],
            category: 'Moderation',
            description: {
                    content: 'Unmutes a user',
                    usage: 'unmute [@user] <reason>',
                    examples: ['unmute @user false mute']
            },
            channel: 'guild',
            userPermissions: ['MANAGE_ROLES'],
            clientPermissions: ['MANAGE_ROLES'],
            ratelimit: 3,
            args: [
                {
                    id: 'member',
                    type: 'member',
                    prompt: {
                        start: (msg: Message) => `${msg.author}, please select a member to unmute`,
                        retry: (msg: Message) => `${msg.author}, please select a valid member to unmute`,
                        cancel: () => 'The command has now been cancelled.'
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
        const muteRole = message.guild.roles.resolve(this.client.settings.get(message.guild, 'muteRole', ''))

        if (!muteRole) return message.util!.send('You need to set a mute role before being able to mute a user.')
        if (!muteRole.editable) return message.util!.send('I am unable to take the mute role to members. Please make sure my role is above this role.')

        if (member.roles.cache.find(r => r === muteRole)) {
            const newCase = new Case()

            
            newCase.guildID = message.guild.id
            newCase.messageID = message.id
            newCase.caseID = totalCases
    
            newCase.action = ModUtil.CONSTANTS.ACTIONS.UNMUTE
            newCase.actionComplete = true
            newCase.reason = reason
            
            newCase.targetID = member.id
            newCase.targetTag = member.user.tag
            newCase.modID = message.author.id
            newCase.modTag = message.author.tag

            await caseRepo.save(newCase)
            this.client.settings.set(message.guild, 'totalCases', totalCases)

            const errorOnRun = await this.findCancelMute(member, caseRepo)
                .then(async c => { return await this.client.muteManager.cancelMute(c)}) // CHECKS FOR THE EXISTING MUTE ON THE USER AND REMOVES IT WITH THE ROLE
                .catch(async () => { member.roles.cache.some(r => r === muteRole) ? await member.roles.remove(muteRole) : void 0 }) //JUST REMOVES THE ROLE OR EXITS IF THEY DON'T HAVE THE ROLE
                
            if (typeof errorOnRun === 'string') return message.util!.send(errorOnRun)

            message.delete({ timeout: 3000 })
            return await message.util!.send(`${member} has been unmuted. Reason: ${reason}`)
        } else {
            return message.util!.send('This user is not muted or I am unable to remove the role from this user.')
        }
    }

    private async findCancelMute(member: GuildMember, repo: Repository<Case>): Promise<Case> {
        try {
            return await repo.find()
                .then(cArr => cArr.find(c => c.targetID === member.user.id && c.action === ModUtil.CONSTANTS.ACTIONS.MUTE && c.actionComplete === false))
        } catch {
            return null
        }
    }
}


/*
        const muteRoleID: RoleResolvable = await this.client.db.getRepository(MuteRole).find()
            .then(mr => { return mr.find(m => m.guild === message.guild.id)})
            .then(m => {return m.role})
            .catch(() => void 0)

        if (userResolved.roles.highest.position < message.guild.me.roles.highest.position) {
            if (userResolved.roles.cache.get(muteRoleID.toString())) {
                userResolved.roles.remove(muteRoleID)
                return message.util!.send(`${userResolved.user.tag} has been unmuted.`)
            }
        }
*/