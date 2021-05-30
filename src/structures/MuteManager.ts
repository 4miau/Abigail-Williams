import { LessThan, Repository } from 'typeorm'
import ms from 'ms'

import BotClient from '../client/BotClient'
import { Case } from '../models/Case'

export default class MuteManager {
    protected client: BotClient
    protected repo: Repository<any>
    protected queuedSchedules = new Map<number, any>()
    protected interval!: NodeJS.Timeout

    protected rate: number


    public constructor(client: BotClient, repository: Repository<any>, { rate = ms('5m') } = {}) {
        this.client = client
        this.repo = repository
        this.rate = rate
    }

    public async _init() {
        await this._check()
        this.interval = setInterval(this._check.bind(this), this.rate)
    }

    private async _check() {
        const caseRepo = this.client.db.getRepository(Case)
        const mutes = await caseRepo.find({ actionDuration: LessThan(new Date(Date.now() + this.rate)), actionComplete: false })
        const now = new Date()

        for (const mute of mutes) {
            if (this.queuedSchedules.has(mute.id)) continue

            if (mute.actionDuration < now) this.cancelMute(mute)
            else this.queueMute(mute)
        }
    }

    public async addMute(mute: Case, rescheduling = false) {
        this.client.logger.log('INFO', `[MUTE] Muted ${mute.targetTag} in ${this.client.guilds.resolve(mute.guildID).name}`)

        if (rescheduling) this.client.logger.log('INFO', `[MUTE] Rescheduled mute on ${mute.targetTag} in ${this.client.guilds.resolve(mute.guildID).name}`)
        if (!rescheduling) {
            const caseRepo = this.client.db.getRepository(Case)

            const newMute = new Case()
    
            newMute.guildID = mute.guildID
            newMute.caseID = mute.caseID
            mute.messageID ? newMute.messageID = mute.messageID : void 0
    
            newMute.action = mute.action
            newMute.actionDuration = mute.actionDuration
            newMute.actionComplete = mute.actionComplete
            newMute.reason = mute.reason
    
            newMute.targetID = mute.targetID
            newMute.targetTag = mute.targetTag
            newMute.modID = mute.modID
            newMute.modTag = mute.modTag
    
            mute = await caseRepo.save(newMute)
        }
        if (mute.actionDuration && mute.actionDuration.getTime() < (Date.now() + this.rate)) this.queueMute(mute)
    }

    public async cancelMute(mute: Case) {
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
        return this.queuedSchedules.delete(mute.id)
    }

    public async deleteMute(mute: Case) {
        const caseRepo = this.client.db.getRepository(Case)
        const schedule = this.queuedSchedules.get(mute.id)
        if (schedule) clearTimeout(schedule)
        this.queuedSchedules.delete(mute.id)
        
        return await caseRepo.delete(mute)
    }

    public queueMute(mute: Case) {
        this.queuedSchedules.set(mute.id, setTimeout(() => { 
            this.cancelMute(mute)
        }, mute.actionDuration.getTime() - Date.now()))
    }

    public rescheduleMute(mute: Case) {
        this.client.logger.log('INFO', 'Rescheduling mute...')
        const schedule = this.queuedSchedules.get(mute.id)
        if (schedule) clearTimeout(schedule)
        this.queuedSchedules.delete(mute.id)
        this.addMute(mute, true)
    }
}