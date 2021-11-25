import { Command } from 'discord-akairo'
import { Message, MessageEmbed } from 'discord.js'

import { Colours } from '../../util/Colours'
import { _GetGame, _GetGameInfo } from '../../util/functions/games'

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
                    id: 'game',
                    type: 'string',
                    match: 'rest'
                }
            ]
        })
    }

    public async exec(message: Message, {game}: {game: string}): Promise<Message> {
        if (!game) return message.util.send('You need to provide a game for me to query.')

        const games: any[] = await _GetGame(game)

        if (games.length === 1) {
            const game = await _GetGameInfo(games[0].id)

            return message.util.send({ embeds: [this.gameEmbed(message, game)] }).finally(() => message.delete())
        } else if (games.length > 1) {
            const gameChoice = await message.channel.send(
                `${games.map((g: any, i: number) => `*[${i + 1}]* \`${g.name}\``).join('\n')}\n\nPlease select between \`1 - ${games.length}\` on the game of your choice.`
            )

            try {
                const filter = (msg: Message) => msg.author.id === message.author.id
                const responseMsg = (await message.channel.awaitMessages({ filter: filter, max: 1, time: 3e4 })).first()
                const choice = Number(responseMsg.content)
                const game = await _GetGameInfo(games[choice - 1].id)

                return gameChoice.edit({ content: 'Game found', embeds: [this.gameEmbed(message, game)] })
                    .finally(() => {
                        message.delete()
                        responseMsg.delete()
                    })
            } catch (err) {
                console.log(err)
                return message.util.send('You did not pick a valid option within the time limit, please try again.')
            }
        }
        else return message.util.send('Unfortunately no results were found, please try making another query.')
    }

    private gameEmbed(msg: Message, game: any) {
        return new MessageEmbed()
            .setAuthor(`${game.name} | Rating: ${game.rating_top }/ 5`)
            .setDescription(game.description_raw.length > 500 ? game.description_raw.substring(0, 500).appendNoSpace('...') : game.description_raw)
            .setColor(Colours.SlateGray)
            .addFields([
                { name: 'Link to official game website', value: game.website || 'Game does not have a site'},
                { name: 'Released', value: !game.tba, inline: true },
                { name: 'Release Date', value: game.released || 'Unknown', inline: true },
                { name: 'Metacritic', value: game.metacritic || 'Metacritic unlisted', inline: true },
                { name: 'Developers', value: game.developers.map((d: any) => `\`${d.name}\``).join(', ') || 'No developers listed' },
                { name: 'Publishers', value: game.publishers.map((p: any) => `\`${p.name}\``).join(', ') || 'No publishers listed' },
                { name: 'Genres', value: game.genres.map((g: any) => `\`${g.name}\``).join(', ') || 'Unlisted' },
                { name: 'Platforms', value: game.platforms.map((p: any) => `\`${p.platform.name}\``).join(', ') || 'Unavailable'}
            ])
            .setImage(game.background_image)
            .setFooter(`ID: ${game.id} | Command ran by ${msg.author.tag} ❤`)
    }
}