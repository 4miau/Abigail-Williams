import { Listener } from 'discord-akairo'
import { Guild, MessageEmbed, TextChannel } from 'discord.js'

import { Colours } from '../../../util/Colours'

export default class GuildUpdate extends Listener {
    public constructor() {
        super('guildupdate', {
            emitter: 'client',
            event: 'guildUpdate',
            category: 'client'
        })
    }

    public async exec(oldGuild: Guild, newGuild: Guild) {
        const guildLogs = newGuild.channels.resolve(this.client.settings.get(newGuild, 'logs.guild-logs', ''))  as TextChannel

        if (guildLogs) {
            let e = new MessageEmbed()
                .setAuthor(`Guild Updated | ${newGuild.name}`, newGuild.iconURL({ dynamic: true }))
                .setColor(Colours.Coral)
                .setThumbnail(newGuild.iconURL({ dynamic: true }))

            if (oldGuild.name !== newGuild.name) {
                e = this.nameChangeEmbed(e, oldGuild, newGuild)
                await guildLogs.send({ embeds: [e] })
            }
            if (oldGuild.icon !== newGuild.icon) {
                e.fields.length > 0 ? e.spliceFields(0, e.fields.length) : void 0
                e = this.iconChangeEmbed(e, oldGuild, newGuild)
                await guildLogs.send({ embeds: [e] })
            }
        }   
    }

    private nameChangeEmbed(embed, oldGuild, newGuild) {
        embed.addField('Old guild name:', oldGuild.name)
        embed.addField('New guild name:', newGuild.name)
        return embed
    }

    private iconChangeEmbed(embed, oldGuild, newGuild) {
        embed.addField('New Guild Icon', 'The icon for this guild has been changed.')
        embed.setImage(newGuild.iconURL({ dynamic: true, format: 'png' }))
        return embed
    }
}