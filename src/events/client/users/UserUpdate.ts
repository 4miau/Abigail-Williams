import { Listener } from 'discord-akairo'
import { TextChannel, User, MessageEmbed } from 'discord.js'

import { Colours } from '../../../util/Colours'

export default class UserUpdate extends Listener {
    public constructor() {
        super('userupdate', {
            emitter: 'client',
            event: 'userUpdate',
            category: 'client'
        })
    }

    public async exec(oldUser: User, newUser: User) {
        for (const guilds of this.client.guilds.cache) {
            const guild = guilds[1]

            if (!guild.members.cache.has(newUser.id)) continue

            const userLogsChannel = guild.channels.resolve(this.client.settings.get(guild, 'logs.user-logs', '')) as TextChannel

            if (userLogsChannel && oldUser.avatarURL() !== newUser.avatarURL()) {
                const e = new MessageEmbed()
                    .setAuthor(`User Update | ${newUser.tag}`)
                    .setColor(Colours.Coral)
                    .setThumbnail(newUser.displayAvatarURL({ dynamic: true, format: 'png' }))
                    .addField('New avatar', `${newUser.displayAvatarURL({ dynamic: true, format: 'png' })}`)

                userLogsChannel.send({ embeds: [e]})
                if (userLogsChannel !== this.client.abbyLog) this.client.abbyLog.send({ embeds: [e] })
            }
        }
    }
}