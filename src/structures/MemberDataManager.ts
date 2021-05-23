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