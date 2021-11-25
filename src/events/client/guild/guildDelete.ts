import { Listener } from 'discord-akairo'
import { Guild, MessageEmbed } from 'discord.js'

import { Colours } from '../../../util/Colours'

export default class GuildDelete extends Listener {
    public constructor() {
        super('guilddelete', {
            emitter: 'client',
            event: 'guildDelete',
            category: 'client'
        })
    }

    public async exec(guild: Guild) {
        await this.client.settings.clear(guild)
        this.client.starboards.delete(guild.id)

        const e = new MessageEmbed()
            .setAuthor(`Left Guild | ${guild.name}`, this.client.user.displayAvatarURL({ dynamic: true }))
            .setDescription(`I was either kicked/removed from:\n**${guild.name}** (${guild.id})`)
            .setColor(Colours.Crimson)
            .setThumbnail(this.client.user.displayAvatarURL({ dynamic: true }))

        await this.client.abbyLog.send({ embeds: [e] })
    }
}