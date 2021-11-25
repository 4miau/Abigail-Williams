import { User, GuildMember, MessageEmbed } from 'discord.js'
import ms from 'ms'

import type Client from '../client/Abby'
import Profile from '../models/Profile'
import { Colours } from '../util/Colours'

export default class ProfileManager {
    protected client: Client
    protected interval: NodeJS.Timeout

    protected queueSchedules = new Map<string, any>()
    protected rate: number

    public constructor(client: Client, { rate = ms('5m') } = {}) {
        this.client = client
        this.rate = rate
    }

    //PROFILE MANAGEMENT
    public async createProfile(userID: string, guildID: string) {
        await new Profile({
            userID: userID,
            xp: 0,
            level: 0,
            coins: 100,
            items: [],
            motto: 'Nothing special here.',
            about: 'It\'s pretty empty here.',
            guildstats: [{ guild: guildID, points: 0, xp: 0, level: 0, nextWork: null }],
            guilditems: [{ guild: guildID, items: [] }],
        }).save()
    }

    public async updateProfile(userID: string, guildID: string) {
        const user = await Profile.findOne({ userID: userID })

        if (!user) return this.createProfile(userID, guildID ? guildID : void 0)

        user.guildstats.push({ guild: guildID, points: 0, xp: 0, level: 0, nextWork: null })
        user.guilditems.push({ guild: guildID, items: [] })

        return user.updateOne(user)
    }

    public async levelUp(member: User | GuildMember, global: boolean) {
        const user = await Profile.findOne({ userID: member.id })
        if (!user) return

        if (global) {
            const userXP = user.xp

            if (!(userXP >= this.getNeededXP(user.level + 1))) return

            ++user.level
            user.xp -= this.getNeededXP(user.level)

            await user.updateOne(user)

            return new MessageEmbed()
                .setAuthor(`${(member as User).tag} has levelled up!`, (member as User).displayAvatarURL({ dynamic: true, format: 'png' }))
                .setDescription(`Congratulations! ${member}'s global level has just reached level \`${user.level}!\``)
                .setColor(Colours.NovaGreen)
                .setThumbnail((member as User).displayAvatarURL({ dynamic: true, format: 'png' }))
        }
        else {
            const userStatPos = user.guildstats.findIndex(gs => gs.guild === (member as GuildMember).guild.id)
            const userXP = user.guildstats.find(gs => gs.guild === (member as GuildMember).guild.id).xp

            if (!(userXP >= this.getNeededXP(user.guildstats[userStatPos].level + 1))) return

            ++user.guildstats[userStatPos].level
            user.guildstats[userStatPos].xp -= this.getNeededXP(user.guildstats[userStatPos].level)

            await user.updateOne(user)

            const e = new MessageEmbed()
                .setAuthor(`${(member as GuildMember).user.tag} has levelled up!`, (member as GuildMember).user.displayAvatarURL({ dynamic: true, format: 'png' }))
                .setDescription(`Congratulations! ${member}'s level has just reached level \`${user.guildstats[userStatPos].level}\`!`)
                .setColor(Colours.NovaGreen)
                .setThumbnail((member as GuildMember).user.displayAvatarURL({ dynamic: true, format: 'png' }))

            return this.addRoleReward((member as GuildMember), e, userStatPos)
        }
    }

    //GET
    public getNeededXP(level: number): number { return Number((level * 2.4 * 100).toFixed(0)) }

    public async getCoins(userID: string): Promise<number> {
        const user = await Profile.findOne({ userID: userID })
        if (!user) return

        return user.coins
    }

    public async getPoints(userID: string, guildID: string): Promise<number> {
        const user = await Profile.findOne({ userID: userID })
        if (!user || !user.guildstats.some(gs => gs.guild === guildID)) return

        return user.guildstats.find(gs => gs.guild === guildID).points
    }

    public async getLevel(userID: string): Promise<number[]> {
        const user = await Profile.findOne({ userID: userID })
        if (!user) return

        return [user.xp, user.level]
    }

    public async getGuildLevel(userID: string, guildID: string): Promise<number[]> {
        const user = await Profile.findOne({ userID: userID })
        if (!user || !user.guildstats.some(gs => gs.guild === guildID)) return

        const guildstats = user.guildstats.find(gs => gs.guild === guildID)

        return [guildstats.xp, guildstats.level]
    }

    //ADD
    public async addCoins(member: User | GuildMember, amount: number) {
        const user = await Profile.findOne({ userID: member.id })

        if (!user) return

        if (member instanceof GuildMember) {
            const statPos = user.guildstats.findIndex(gs => gs.guild === member.guild.id)

            user.guildstats[statPos].points += amount
            
            return user.updateOne(user)
        }
        else {
            user.coins += amount
            return user.updateOne(user)
        }
    }

    public async addXP(member: User | GuildMember, amount: number) {
        const user = await Profile.findOne({ userID: member.id })

        if (!user) return

        if (member instanceof GuildMember) {
            const statPos = user.guildstats.findIndex(gs => gs.guild === member.guild.id)
            user.guildstats[statPos].xp += amount

            this.client.xpAdded.add(member.user.id)

            await user.updateOne(user)
            return this.levelUp(member, false)
        }
        else {
            user.xp += amount
            this.client.xpAdded.add(member.id)

            await user.updateOne(user)
            return this.levelUp(member, true)
        }
    }

    public async addRateLimit(member: GuildMember, type: string) {
        const user = await Profile.findOne({ userID: member.user.id })
        if (!user) return

        const guildIndex = user.guildstats.findIndex(gs => gs.guild === member.guild.id)
        if (guildIndex === -1) return


        const rateLimitType = {
            'work': async () => {
                user.guildstats[guildIndex].nextWork = new Date(Date.now() + ms('4h'))
                return user.updateOne(user)
            }
        }

        return rateLimitType[type].call()
    }

    public async addRoleReward(member: GuildMember, embed: MessageEmbed, statIndex: number): Promise<MessageEmbed> {
        const user = await Profile.findOne({ userID: member.user.id })
        const guildRoleRewards: { role: string, level: number }[] = this.client.settings.get((member as GuildMember).guild, 'level-roles', [{}])
        const stackRewards: boolean = this.client.settings.get((member as GuildMember).guild, 'stack-role', false)

        if (guildRoleRewards.arrayEmpty() || guildRoleRewards.every(r => r.level > user.guildstats[statIndex].level)) return embed

        guildRoleRewards.forEach(async r => {
            const newRole = member.guild.roles.cache.get(r.role)
            if (!newRole) return

            if (user.guildstats[statIndex].level !== r.level) return

            try {
                if (stackRewards) {
                    await member.roles.add(newRole)
                    embed.addField('New role obtained!', `Congratulations you have just earnt \`${newRole.name}\`!`)
                }
                else {
                    const oldReward = guildRoleRewards.find(reward => member.roles.cache.has(reward.role))
    
                    if (oldReward) await member.roles.remove(oldReward.role)
                        
                    await member.roles.add(newRole)
                    embed.addField('New role obtained!', `Congratulations you have just earnt \`${newRole.name}\`!`)
                }                
            } catch {
                this.client.logger.log('CAUTION', `Unable to add ${member.user.tag} role because not managable.`)
            }
        })

        return embed
    }

    //REMOVE
    public async removeCoins(member: User | GuildMember, amount: number) {
        const user = await Profile.findOne({ userID: member.id })

        if (!user) return

        if (member instanceof GuildMember) {
            const statPos = user.guildstats.findIndex(gs => gs.guild === member.guild.id)
            
            user.guildstats[statPos].points -= amount
            return user.updateOne(user)
        }
        else {
            user.coins -= amount
            return user.updateOne(user)
        }
    }

    public async removeXP(member: User | GuildMember, amount: number) {
        const user = await Profile.findOne({ userID: member.id })
        if (!user) return

        if (member instanceof GuildMember) {
            const statPos = user.guildstats.findIndex(gs => gs.guild === member.guild.id)

            user.guildstats[statPos].xp -= amount

            if (user.guildstats[statPos].xp < 0) {
                --user.guildstats[statPos].level
                user.guildstats[statPos].xp = (this.getNeededXP(user.guildstats[statPos].level + 1) + user.guildstats[statPos].xp)
            }

            return user.updateOne(user)
        }
        else {
            user.xp -= amount

            if (user.xp < 0) {
                --user.level
                user.xp = (this.getNeededXP(user.level + 1) + user.xp)
            }

            return user.updateOne(user)
        }
    }
}


/*
export default class ProfileManager {
    public async _init() {
        await this._check()
        this.interval = setInterval(this._check.bind(this), this.rate)
    }

    private async _check() {
        const profilesDue = await this.model.find({ nextWork: { $lt: (new Date(Date.now() + this.rate)) }})
        const now = new Date()

        for (const profile of profilesDue) {
            if (this.queuedSchedules.has(profile.userID)) continue

            //if (profile.nextWork < now) this.cancelTimeout(profile)
            //else this.queueTimeout(profile)
        }
    }

    public async buyItem() {
        console.log('Make buy method')
    }

    public async sellItem() {
        console.log('Make sell method')
    }

    public async displayInventory() {
        console.log('Make item system')
    }
}
*/

//TODO: Optimize