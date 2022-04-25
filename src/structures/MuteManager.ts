import ms from 'ms'

import Abby from '../client/Abby'
import Case, { ICase } from '../models/Case'

export default class MuteManager {
    protected client: Abby
    protected model: typeof Case
    protected queuedSchedules = new Map<number, any>()
    protected interval!: NodeJS.Timeout

    protected rate: number


    public constructor(client: Abby, model: typeof Case, { rate = ms('5m') } = {}) {
        this.client = client
        this.model = model
        this.rate = rate
    }

    public async _init() {
        await this._check()
        this.interval = setInterval(this._check.bind(this), this.rate)
    }

    private async _check() {
        const mutes = await Case.find({ actionDuration: { $lt : (new Date(Date.now() + this.rate)) }, actionComplete: false })
        const now = new Date()

        for (const mute of mutes) {
            if (this.queuedSchedules.has(mute.id)) continue

            if (mute.actionDuration < now) this.cancelMute(mute)
            else this.queueMute(mute)
        }
    }

    public async addMute(mute: ICase, rescheduling = false) {
        this.client.logger.log('INFO', `[MUTE] Muted ${mute.targetTag} in ${this.client.guilds.resolve(mute.guildID).name}`)

        if (rescheduling) this.client.logger.log('INFO', `[MUTE] Rescheduled mute on ${mute.targetTag} in ${this.client.guilds.resolve(mute.guildID).name}`)
        else {
            await mute.updateOne(mute)
        }

        if (mute.actionDuration && mute.actionDuration.getTime() < (Date.now() + this.rate)) this.queueMute(mute)
    }

    public async cancelMute(mute: ICase) {
        this.client.logger.log('INFO', `[UNMUTE] Unmuted ${mute.targetTag} in ${this.client.guilds.resolve(mute.guildID).name}`)

        const guild = await this.client.guilds.fetch(mute.guildID)
        const muteRole = this.client.settings.get(guild, 'muteRole', '')
        const member = guild.members.resolve(mute.targetID) ? guild.members.resolve(mute.targetID) : void 0

        if (!muteRole) return 'You need to set a mute role before being able to mute a user.'
        if (!member) return 'Unable to resolve user, most likely no longer in the guild.'

        try { await member.roles.remove(muteRole) }
        catch { return 'This user is not muted or I am unable to remove the role from this user.'}

        mute.actionComplete = true
        await mute.save()

        const schedule = this.queuedSchedules.get(mute.id)

        if (schedule) clearTimeout(schedule)
        return this.queuedSchedules.delete(mute.id)
    }

    public async deleteMute(mute: ICase) {
        const schedule = this.queuedSchedules.get(mute.id)
        if (schedule) clearTimeout(schedule)
        this.queuedSchedules.delete(mute.id)

        return mute.delete()
    }

    public queueMute(mute: ICase) {
        this.queuedSchedules.set(mute.id, setTimeout(() => { this.cancelMute(mute)}, mute.actionDuration.getTime() - Date.now()))
    }

    public rescheduleMute(mute: ICase) {
        this.client.logger.log('INFO', 'Rescheduling mute...')
        const schedule = this.queuedSchedules.get(mute.id)
        if (schedule) clearTimeout(schedule)
        this.queuedSchedules.delete(mute.id)
        this.addMute(mute, true)
    }
}