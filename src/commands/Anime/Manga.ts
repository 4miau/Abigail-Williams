import { Command } from 'discord-akairo'
import { Message, MessageEmbed } from 'discord.js'
import moment from 'moment'

import { Colours } from '../../util/Colours'
import { MALLogo } from '../../util/Constants'
import { _MALQuery } from '../../util/functions/myanimelist'

export default class Manga extends Command {
    public constructor() {
        super('manga', {
            aliases: ['manga', 'mangainfo', 'searchmanga', 'findmanga'],
            category: 'Anime',
            description: {
                content: 'Searches for mangas and retrieves information on the manga from MyAnimeList. You can use multiple tags.',
                usage: 'manga [query] <tag>',
                examples: ['manga Demon Slayer'],
            },
            channel: 'guild',
            ratelimit: 3,
            args: [
                {
                    id: 'query',
                    type: 'string',
                    match: 'rest'
                }
            ]
        })
    }

    public async exec(message: Message, {query}: {query: string}): Promise<Message> {
        if (!query) return message.channel.send('You need to provide a query to make a search. Please try again.')

        const res = await _MALQuery('manga', query)

        if (res.length === 1 || res[0].node.title.caseCompare(query?.trim())) {
            const found = res[0].node

            return message.util.send({ embeds: [this.mangaEmbed(message, found)] }).finally(() => message.delete())

        } else if (res.length > 1) {
            const response = await message.channel.send(
                `${res.map((a: any, i: number) => `*[${i + 1}]* \`${a.node.title}\``).join('\n')}\n\n` + `Please select between \`1 - ${res.length}\` of which manga to choose.`
            )

            try {
                const filter = (msg: Message) => msg.author.id === message.author.id
                const responseMsg = (await message.channel.awaitMessages({ filter: filter, max: 1, time: 30000 })).first()
                const choice = Number(responseMsg.content)
                const found = res[choice - 1].node

                return response.edit({ embeds: [this.mangaEmbed(message, found)] })
                    .finally(() => {
                        message.delete()
                        responseMsg.delete()
                    })
            }
            catch (err) {
                console.log(err)
                return message.channel.send('You did not pick a valid option, please try again.')
            }
        }
        else return message.channel.send('Unfortunately no results were found, please try making another query.')
    }

    private mangaEmbed(msg: Message, manga: any) {
        return new MessageEmbed()
            .setAuthor(`${manga.title.length > 30 ? manga.title.substring(0, 30).appendNoSpace('...') : manga.title} | ${manga.status.replaceAll('_', ' ')}`, MALLogo)
            .setThumbnail(manga.main_picture.medium)
            .setDescription(manga.synopsis.length > 512 ? manga.synopsis.substring(0, 512).appendNoSpace('...') : manga.synopsis)
            .setColor(Colours.SteelBlue)
            .addFields([
                { 
                    name: 'Last published', 
                    value: moment(new Date(manga.updated_at)).format('YYYY-MM-DD HH:mm:ss') || 'Unknown'
                },
                { name: 'Chapters', value: String(manga.num_chapters) || 'Ongoing', inline: true },
                { name: 'Volumes', value: String(manga.num_volumes) || 'Ongoing', inline: true },
                { name: 'Authors', value: manga.authors.map((a: any) => `${a.node.first_name} ${a.node.last_name}`).join(', ') || 'Unknown', inline: true },
                { name: 'Genres', value: manga.genres.map((g: any) => `\`${g.name}\``).join(', ') || 'Unlisted' },
            ])
            .setImage(manga.main_picture.large)
            .setFooter(`ID: #${manga.id} | Command ran by ${msg.author.tag} ❤`)
    }
}