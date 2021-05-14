import { Command } from 'discord-akairo'
import { Message, MessageEmbed } from 'discord.js'
import { Colours } from '../../util/Colours'
import { legendHeader } from '../../util/Constants'
import { ConvertRank, _GetApexPlayer } from '../../util/Functions'

export default class ApexLegends extends Command {
    public constructor() {
        super('apexlegends', {
            aliases: ['apexlegends', 'apex', 'getapexplayer'],
            category: '',
            description: {
                content: 'Gets stats on Apex Legends player',
                usage: 'apex [platform] [name]',
                examples: ['apex origin miau'],
                flags: ['psn', 'xbox', 'origin', 'pc']
            },
            ratelimit: 3,
            args: [
                {
                    id: 'platform',
                    type: (_: Message, str: string): null | string => {
                        if (str === 'ps4' || str === 'xbox' || str === 'pc' || str === 'origin') return str
                        return null
                    },
                    match: 'phrase'
                },
                {
                    id: 'name',
                    type: 'string',
                    match: 'rest'
                }
            ]
        })
    }

    public async exec(message: Message, {platform, name}: {platform: string, name: string}): Promise<Message> {
        if (!platform) return message.util!.send('You need a platform to search for (psn, xbox, pc).')
        if (!name) return message.util!.send('You need to provide a name to search for.')

        const player = await _GetApexPlayer(platform, name)

        if (!player) return message.util!.send('Unable to find this user.')

        return message.util!.send(new MessageEmbed()
            .setAuthor(`Stats for: ${player.platformInfo.platformUserId} playing ${player.metadata.activeLegendName}`, `${player.platformInfo.avatarUrl}`)
            .setColor(Colours.Crimson)
            .addField('Account & Total Stats', `
            Level: ${player.segments[0].stats.level.value ? player.segments[0].stats.level.value + '/ 500' : 'Unable to get level' } 
            Total Kills: ${player.segments[0].stats.kills.value}
            `, true)
            .addField('Score', `${player.segments[0].stats.rankScore.value + ' RP'}`, true)
            .addField('Rank', `${player.segments[0].stats.rankScore.metadata ? 
                ConvertRank(player.segments[0].stats.rankScore.metadata.rankName) + ' ' + player.segments[0].stats.rankScore.metadata.rankName 
                : 
                'No rank'}`, false)
            .setImage(legendHeader[player.metadata.activeLegendName])
            .setFooter('Incorrect information? Contact miau#0004')
        )

        //console.log(await _GetApexPlayer(platform, name))
    }
}