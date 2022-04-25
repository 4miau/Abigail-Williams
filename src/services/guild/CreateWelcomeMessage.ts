import { GuildMember } from 'discord.js'
import moment from 'moment'

import Service from '../../modules/Service'

export default class CreateWelcomeMessage extends Service {
    public constructor() {
        super('createwelcomemessage', {
            category: 'GuildSync'
        })
    }

    exec(member: GuildMember, content: string): string {
        return content
            .replaceAll('{user}', `${member}`)
            .replaceAll('{userName}', `${member.user.username}`)
            .replaceAll('{nick}', member.nickname ? member.nickname : member.displayName)
            .replaceAll('{server}', member.guild.name)
            .replaceAll('{time}', `${moment(member.joinedAt).utcOffset(1).format('YYYY/MM/DD HH:mm:ss')}`)
    }
}