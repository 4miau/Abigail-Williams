import { GuildMember, Guild, Message, Role, TextChannel } from 'discord.js'
import Jimp from 'jimp'
import moment from 'moment'
import fs from 'fs'
import { join } from 'path'

import Abby from '../../client/Abby'
import { ICase } from '../../models/Case'

export function createWelcomeMessage(member: GuildMember, content: string): string {
    return content
        .replaceAll('{user}', `${member}`)
        .replaceAll('{userName}', `${member.user.username}`)
        .replaceAll('{nick}', member.nickname ? member.nickname : member.displayName)
        .replaceAll('{server}', member.guild.name)
        .replaceAll('{time}', `${moment(member.joinedAt).utcOffset(1).format('YYYY/MM/DD HH:mm:ss')}`)
}

export function getJoinPosition(member: GuildMember, guild: Guild): number {
    if (!member || !guild) return

    const memberArr = guild.members.cache.sort((a: any, b: any) => a.joinedAt - b.joinedAt).map(u => u)
    return (memberArr.findIndex(m => m.id === member.id) + 1)
}

export async function createCaptcha() {
    const captcha = Math.random().toString(36).slice(2, 8)
    const img = new Jimp(175, 50, 'white')
    const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK)
    const w = img.bitmap.width
    const h = img.bitmap.height
    const textWidth = Jimp.measureText(font, captcha)
    const textHeight = Jimp.measureTextHeight(font, captcha, w)
    img.print(font, (w/2 - textWidth/2), (h/2 - textHeight/2), captcha)
    img.write(join(__dirname, '..', '..', 'captchas', `${captcha}.png`))
    return captcha
}

export async function Captcha(channel: TextChannel, member: GuildMember) {
    const captcha = await createCaptcha()

    try {
        await member.createDM(true)
            .then(async dmChannel => {
                const msg = await dmChannel.send({
                    content: 'You have 1 minute to solve the captcha.',
                    files: [{
                        attachment: join(__dirname, '..', '..', 'captchas', `${captcha}.png`),
                        name: `${captcha}.png`
                    }]
                })
                const filter = (m: Message) => {
                    if (m.author.bot) return
                    if (m.author.id === member.user.id && m.content === captcha) return true
                    else {
                        m.channel.send('You entered the captcha incorrectly.')
                        return false
                    }
                }

                const res = await msg.channel.awaitMessages({ filter: filter, max: 1, time: 30000 })
                if (res) {
                    const verifiedRole: string = this.client.settings.get(member.guild, 'verification.verified-role', '')
                    const unverifiedRole: string = this.client.settings.get(member.guild, 'verification.unverified-role', '')
                    await msg.channel.send('You have verified yourself.')
                    if (verifiedRole || unverifiedRole) {
                        verifiedRole ? await member.roles.add(verifiedRole) : void 0
                        unverifiedRole ? await member.roles.remove(unverifiedRole) : void 0
                    }
                    fs.unlinkSync(join(__dirname, '..', '..', 'captchas', `${captcha}.png`))
                }
            })
    } catch {
        channel.send(`You need to enable DMs from this server to be able to receive a captcha ${member}.`)
    }
    
}

export async function manageAutorole(message: Message, role: Role, target: AutoroleTags, add: boolean): Promise<Message> {
    const client = message.guild.client as Abby
    const autoRoles : { humans: string[], bots: string[], all: string[] } = client.settings.get(message.guild, 'autoRoles', {})
    
    if (add) {
        if (autoRoles[target].arrayEmpty()) {
            client.settings.set(message.guild, `autoRoles.${target}`, [role.id])
            return message.util.send(`Successfully added new autorole for ${target}`)
        }
        if (autoRoles[target] && autoRoles[target].includes(role.id)) return message.util.send(`This role is already on the autorole list for ${target}`)

        autoRoles[target].push(role.id)
        client.settings.set(message.guild, `autoRoles.${target}`, autoRoles[target])
    }
    else {
        if (autoRoles[target].arrayEmpty()) return message.util.send(`There are no autoroles for ${target} exclusively.`)
        if (!autoRoles[target].includes(role.id)) return message.util.send(`This role is not on the ${target} autorole list`)

        client.settings.set(message.guild, `autoRoles.${target}`, autoRoles[target].filter(ar => ar !== role.id))
        return message.util.send(`Successfully removed role from the ${target} autorole list.`)
    }
}

export function editLogMessage(message: Message, oldCase: ICase, reason: string) {
    const member = message.guild.members.resolve(oldCase.targetID)
    const mod = message.guild.members.resolve(oldCase.modID)

    const description = {
        1: () => { return message.embeds[0].setDescription('') },
        2: () => { return message.embeds[0].setDescription('') },
        3: () => { return message.embeds[0].setDescription('') },
        4: () => { return message.embeds[0].setDescription('') },
        5: () => { 
            return message.embeds[0].setDescription(
                `[\`${moment(oldCase.createdAt).format('HH:mm:ss')}\`] [\`${oldCase.caseID}\`] :mute: **${oldCase.modTag}** muted **${oldCase.targetTag}** (ID: ${oldCase.targetID})\n` +
                `\`[ Reason ]:\` ${reason}`
            ) 
        },
        6: () => { 
            return message.embeds[0].setDescription(
                `[\`${moment(oldCase.createdAt).format('HH:mm:ss')}\`] [\`${oldCase.caseID}\`] :loud_sound: **${oldCase.modTag}** unmuted **${oldCase.targetTag}** (ID: ${oldCase.targetID})\n` +
                `\`[ Reason ]:\` ${reason}`
            ) 
        },
        7: () => { return message.embeds[0].setDescription('') },
        8: () => { return message.embeds[0].setDescription('') },
        9: () => { return message.embeds[0].setDescription('') },
    }

    return description[oldCase.action].call()
}