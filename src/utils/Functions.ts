import { Guild, GuildMember } from "discord.js"

export function getRandomInt(length: number) {
    return Math.floor(Math.random() * length)
}

export function getRandomIntRange(min: number, max: number) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * ((max - min) + 1))
}

export function splitArrayNth(stArr: string[], splitter: number): string[] {
    for(var i = 0; i < stArr.length; i++) {
        if (i % splitter) {
            stArr[i] += '\n'
        }

        return stArr
    }
}

export function getJoinPosition(member: GuildMember, guild: Guild): number {
    if (!member || !guild) return

    const memberIDArr = guild.members.cache.sort((a: any, b: any) =>  a.joinedAt - b.joinedAt).keyArray()
    return (memberIDArr.findIndex(id => id === member.id) + 1)
}