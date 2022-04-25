import { GuildMember, Guild } from 'discord.js'

import Service from '../../modules/Service'

export default class GetJoinPosition extends Service {
    public constructor() {
        super('getjoinposition', {
            category: 'GuildSync'
        })
    }

    exec(member: GuildMember, guild: Guild): number {
        if (!member || !guild) return

        const memberArr = guild.members.cache.sort((a: any, b: any) => a.joinedAt - b.joinedAt).map(u => u)
        return (memberArr.findIndex(m => m.id === member.id) + 1)
    }
}