import { Repository } from "typeorm";

import BotClient from "../client/BotClient";
import { MemberData } from "../models/MemberData";

export default class MemberDataManager {
    protected client: BotClient
    protected repo: Repository<any>

    public constructor(client: BotClient, repository: Repository<any>) {
        this.client = client
        this.repo = repository
    }

    public async addWarn(memberData: MemberData) {
        this.client.logger.log('INFO', `[WARN] Adding a warn to ${memberData.memberID}`)

        const memberDataRepo = this.client.db.getRepository(MemberData)
        const newWarn = new MemberData()

        newWarn.memberID = memberData.memberID
        newWarn.activeWarns = memberData.activeWarns

        if (!newWarn.activeWarns) newWarn.activeWarns = 1

        memberDataRepo.save(newWarn)
    }

    public async pardonWarn(memberData: MemberData) {
        this.client.logger.log('INFO', `[WARN] Pardoning a warn from ${memberData.memberID}`)

        const memberDataRepo = this.client.db.getRepository(MemberData)
        const oldWarn = await memberDataRepo.findOne({ memberID: memberData.memberID })
        
        if (!oldWarn) oldWarn.activeWarns = 0
        if (oldWarn.activeWarns === 0 || oldWarn.activeWarns === -1) return;

        oldWarn.activeWarns -= 1
        memberDataRepo.save(oldWarn)
    }
}

/*
        this.client.logger.log('INFO', `[MUTE] Unmuted ${mute.targetTag} in ${this.client.guilds.resolve(mute.guildID).name}`)

        const caseRepo = this.client.db.getRepository(Case)

        const guild = await this.client.guilds.fetch(mute.guildID)
        const muteRole = this.client.settings.get(guild, 'muteRole', '')
        const member = guild.members.resolve(mute.targetID) ? guild.members.resolve(mute.targetID) : void 0

        if (!muteRole) return 'You need to set a mute role before being able to mute a user.'
        if (!member) return 'Unable to resolve user, most likely no longer in the guild.'

        try { await member.roles.remove(muteRole) }
        catch { return 'This user is not muted or I am unable to remove the role from this user.'}

        mute.actionComplete = true
        await caseRepo.save(mute)

        const schedule = this.queuedSchedules.get(mute.id)

        if (schedule) clearTimeout(schedule)
        return this.queuedSchedules.delete(mute.id
*/