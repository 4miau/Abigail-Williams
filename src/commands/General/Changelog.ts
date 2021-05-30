import { Command } from 'discord-akairo'
import { Message, MessageEmbed } from 'discord.js'

import { Colours } from '../../util/Colours'
import { botVersion } from '../../Config'

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
                        if (str && Number(str)) if (Number(str) > 0) return Number(str)
                        return 1
                    }
                }
            ]
        })
    }

    public exec(message: Message, {page}: {page: number}): Promise<Message> {
        const changeLog: { key: number, type: string, content: string }[] = this.client.settings.get('global', 'changeLog', [])

        const perPage = 10
        const maxPages = Math.ceil(changeLog.length / perPage)

        page = changeLog.length ? page : 1

        const end = page * perPage
        const start = end - perPage

        const logs = changeLog.slice(start, end)


        const embed = new MessageEmbed()
            .setAuthor(`Bot Changelog | v${botVersion}`, this.client.user.displayAvatarURL())
            .setDescription(`
                ${logs.length > 0 ? logs.map(e => `(${e.key}) [${e.type}] : ${e.content}`).join('\n') : 
                `No listed changelogs ${page > 1 ? `on page ${page}` : `at the moment`}`}`
            )
            .setThumbnail(this.client.users.cache.get(this.client.ownerID as string).displayAvatarURL())
            .setColor(Colours.Pinky)
            .setFooter(`Page ${page > maxPages ? maxPages : page} of ${maxPages} | Key: ADD: Add, UPD: Update, DEL: Delete, FIX: Fix, CHO: Chore`)

        return message.util!.send(embed)
    }
}