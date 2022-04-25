import { Command } from 'discord-akairo'
import { Message, MessageEmbed } from 'discord.js'

import { Colours } from '../../util/Colours'

export default class GameInfo extends Command {
    public constructor() {
        super('gameinfo', {
            aliases: ['gameinfo', 'searchgame'],
            category: 'Games',
            description: {
                content: 'Gets information on any queried game.',
                usage: 'gameinfo [gamename]',
                examples: ['gameinfo Azur Lane: CrossOver'],
            },
            channel: 'guild',
            ratelimit: 2,
            cooldown: 6e4,
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
        if (!query) return message.channel.send('You need to provide a game for me to query.')

        const gameServices = this.client.serviceHandler.modules.getArr('getgame', 'getgameinfo')
        const miscServices = this.client.serviceHandler.modules.get('getinput')

        const games: any[] = await gameServices[0].exec(query)

        if (games.length === 1) {
            const game = await gameServices[1].exec(games[0].id)
            return message.channel.send({ embeds: [this.gameEmbed(message, game)] }).finally(() => message ? message.delete() : void 0)
        }
        else if (games.length > 1) {
            try {           
                const choice = Number(await miscServices.exec(
                    `${games.map((g: any, i: number) => `*[${i + 1}]* \`${g.name}\``).join('\n')}` + 
                    `\n\nPlease select between \`1 - ${games.length}\` on the game of your choice.`,
                    message.channel,
                    message.author.id,
                    true
                ))
                //!req: string, chnl: TextChannel, userID: string = null, del: boolean = false

                const game = await gameServices[1].exec(games[choice - 1].id)

                return message.channel.send({ embeds: [this.gameEmbed(message, game)]})
                    .finally(() => { message.delete().catch(void 0) })
            } catch (err) {
                console.log(err)
                return message.channel.send('You did not pick a valid option within the time limit, please try again.')
            }
        }
        else return message.channel.send('No results found.')
    }

    private gameEmbed(msg: Message, game: any) {
        return new MessageEmbed()
            .setAuthor(`${game.name} | Rating: ${game.rating_top }/5`)
            .setDescription(game.description_raw.length > 500 ? game.description_raw.substring(0, 500).appendNoSpace('...') : game.description_raw)
            .setColor(Colours.SlateGray)
            .addFields([
                { name: 'Link to official game website', value: game.website || 'Game does not have a site'},
                { name: 'Released', value: String(!game.tba), inline: true },
                { name: 'Release Date', value: String(game.released) || 'Unknown', inline: true },
                { name: 'Metacritic', value: String(game.metacritic) || 'Unlisted', inline: true },
                { name: 'Developers', value: game.developers.map((d: any) => `\`${d.name}\``).join(', ') || 'No developers listed' },
                { name: 'Publishers', value: game.publishers.map((p: any) => `\`${p.name}\``).join(', ') || 'No publishers listed' },
                { name: 'Genres', value: game.genres.map((g: any) => `\`${g.name}\``).join(', ') || 'Unlisted' },
                { name: 'Platforms', value: game.platforms.map((p: any) => `\`${p.platform.name}\``).join(', ') || 'Unavailable'}
            ])
            .setImage(game.background_image)
            .setFooter(`ID: ${game.id} | Command ran by ${msg.author.tag} ❤`)
    }
}