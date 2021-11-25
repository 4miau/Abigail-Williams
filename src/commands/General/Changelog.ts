import { Command } from 'discord-akairo'
import { Message, MessageEmbed } from 'discord.js'

import { Colours } from '../../util/Colours'
import { envs } from '../../client/Components'

export default class Changelog extends Command {
    public constructor() {
        super('changelog', {
            aliases: ['changelog'],
            category: 'General',
            description: {
                content: 'Displays my recent updates and changelog.',
                usage: 'changelog <page>',
                examples: ['changelog', 'changelog 3'],
            },
            ratelimit: 3,
            args: [
                {
                    id: 'page',
                    type: (_: Message, str: string): number => {
                        return (str && Number(str) && Number(str) > 0) ? Number(str) : null
                    }
                }
            ]
        })
    }

    public exec(message: Message, {page}: {page: number}): Promise<Message> {
        const changeLog: { key: number, type: string, content: string }[] = this.client.settings.get('global', 'changeLog', [])

        page = !isNaN(page) ? page : 1
        const logs = changeLog.paginate(page || 1, 10)

        const e = new MessageEmbed()
            .setAuthor(`Bot Changelog | v${envs.botVersion}`, this.client.user.displayAvatarURL())
            .setDescription(
                !logs[0].arrayEmpty() ? 
                    logs[0].map(e => `(${e.key}) [${e.type}] : ${e.content}`).join('\n') :
                    'No listed changelogs ' + (page || 1 > 1 ? `on page ${page}` : 'at the moment')
            )
            .setThumbnail(this.client.users.cache.get(this.client.ownerID as string).displayAvatarURL())
            .setColor(Colours.Pinky)
            .setFooter(`Page ${page > logs[1] ? logs[1] : page} of ${logs[1]} | Key: ADD: Add, UPD: Update, DEL: Delete, FIX: Fix, CHO: Chore`)

        return message.channel.send({ embeds: [e] })
    }
}