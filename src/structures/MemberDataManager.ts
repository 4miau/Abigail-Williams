import Abby from '../client/Abby'
import MemberData, { IMemberData } from '../models/MemberData'

export default class MemberDataManager {
    protected client: Abby
    protected model: typeof MemberData

    public constructor(client: Abby, model: typeof MemberData) {
        this.client = client
        this.model = model
    }

    public async addWarn(memberData: IMemberData) {
        this.client.logger.log('INFO', `[WARN] Adding a warn to ${memberData.memberID}`)

        const newWarn = new MemberData()

        newWarn.memberID = memberData.memberID
        newWarn.memberTag = memberData.memberTag
        newWarn.activeWarns = memberData.activeWarns

        if (!newWarn.activeWarns) newWarn.activeWarns = 1

        await newWarn.updateOne(newWarn)
    }

    public async pardonWarn(memberData: IMemberData) {
        this.client.logger.log('INFO', `[WARN] Pardoning a warn from ${memberData.memberID}`)

        const oldWarn = await MemberData.findOne({ memberID: memberData.memberID })
        
        if (!oldWarn) oldWarn.activeWarns = 0
        if (oldWarn.activeWarns === 0 || oldWarn.activeWarns === -1) return

        oldWarn.activeWarns -= 1

        await oldWarn.updateOne(oldWarn)
    }
}