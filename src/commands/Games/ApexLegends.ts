import { Command } from 'discord-akairo'
import { Message, MessageEmbed } from 'discord.js'
import { Colours } from '../../util/Colours'
import { legendHeader } from '../../util/Constants'

export default class ApexLegends extends Command {
    public constructor() {
        super('apexlegends', {
            aliases: ['apexlegends', 'apex', 'getapexplayer'],
            category: 'Games',
            description: {
                content: 'Gets stats on Apex Legends player',
                usage: 'apex [platform] [name]',
                examples: ['apex pc miau'],
                flags: ['psn', 'xbox', 'pc'],
            },
            ratelimit: 3,
            args: [
                {
                    id: 'platform',
                    type: (_: Message, str: string): null | string => {
                        str = str.toLowerCase()
                        if (str === 'psn' || str === 'xbox' || str === 'pc') return str
                        return null
                    },
                    match: 'phrase',
                },
                {
                    id: 'name',
                    type: 'string',
                    match: 'rest',
                },
            ],
        })
    }

    public async exec(message: Message,{platform, name}: {platform: string; name: string}): Promise<Message> {
        if (!platform) return message.channel.send('You need a platform to search for (psn, xbox, pc)')
        if (!name) return message.channel.send('You need to provide a name to search for.')

        const apexServices = this.client.serviceHandler.modules.getArr('getapexuid', 'getapexuser')

        const uid = await apexServices[0].exec(platform, name) || null
        if (!uid) return message.channel.send('Error retrieving user data, please try again.')

        const playerData = await apexServices[1].exec(platform, uid) || null

        this.client.logger.log('INFO', `${playerData.mozambiquehere_internal}`)

        try {
            const e = this.buildApexEmbed(playerData)
            return message.channel.send({ embeds: [e] })
        } catch (err) {
            this.client.logger.log('ERROR', err.stack || err)
            return message.channel.send('Unable to retrieve user stats, please report this with my `feedback` command.')
        }
    }

    private buildApexEmbed(playerData: any) {
        const rankService = this.client.serviceHandler.modules.get('emojifyrank')
        const rank = playerData.global.rank.rankName + ' ' + playerData.global.rank.rankDiv

        return new MessageEmbed()
            .setAuthor(
                `Stats for ${playerData.global.name} playing ${playerData.legends.selected.LegendName}`,
                `${playerData.global.avatar.toLowerCase().startsWith('https') ? playerData.global.avatar : 'https://i.imgur.com/d0A4Emp.png'}`
            )
            .setDescription(`User is currently ${playerData.realtime.isOnline === 1? '**Online**' : '**Offline**'}`)
            .setColor(Colours.Crimson)
            .addField(
                '**Account**',
                `**Level:** ${playerData.global.level + ' / 500' || 'Unable to fetch'}\n` +
                `**Total Kills:** ${playerData.total.kills?.value || 'Unable to fetch'}`,
                true
            )
            .addField(
                '**Ranked**',
                `**Rank**: ${rankService.exec(rank) + ' ' + rank}\n` +
                `**Score**: ${playerData.global.rank.rankScore}`,
                true
            )
            .addField('\u200B', '**Currently equipped trackers**')
            .addFields([
                {
                    name: `${playerData.legends.selected?.data[0]?.name || 'No data' }`,
                    value: `${playerData.legends.selected?.data[0]?.value || '-'}`,
                    inline: true,
                },
                {
                    name: `${playerData.legends.selected?.data[1]?.name ||'No data'}`,
                    value: `${playerData.legends.selected?.data[1]?.value || '-'}`,
                    inline: true,
                },
                {
                    name: `${playerData.legends.selected?.data[2]?.name || 'No data'}`,
                    value: `${playerData.legends.selected?.data[2]?.value || '-'}`,
                    inline: true,
                },
            ])
            .setImage(legendHeader[playerData.legends.selected.LegendName])
            .setThumbnail(playerData.legends.selected.ImgAssets.icon)
            .setFooter('Incorrect information? Contact `miau#0004`')
    }
}
