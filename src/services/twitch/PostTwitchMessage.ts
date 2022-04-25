import { Guild, MessageEmbed, TextChannel } from 'discord.js'

import Service from '../../modules/Service'
import { Colours } from '../../util/Colours'

export default class PostTwitchMessage extends Service {
    public constructor() {
        super('posttwitchmessage', {
            category: 'Twitch'
        })
    }

    async exec(guild: Guild, feedChannelID: string, streamer: Streamer): Promise<any> {
        const getStreamer = this.handler.modules.get('getuserbyname')
        const getStream = this.handler.modules.get('getstream')
        const createMessage = this.handler.modules.get('createtwitchmessage')

        const streamerData = await getStreamer.exec(streamer.name)
        const stream = await getStream.exec(streamer.name)
        const feedMessage = await createMessage.exec(streamer.name, streamer.message)

        const feedChannel = guild.channels.resolve(feedChannelID) as TextChannel
        const addEmbed: boolean = feedMessage.endsWith('-embed')

        if (feedChannel) {
            if (!addEmbed) return (await feedChannel.send(`${streamer.pings ? streamer.pings.join(', ') : ''} ` + feedMessage)).suppressEmbeds(true)
            else {
                const streamEmbed = new MessageEmbed()
                    .setAuthor(streamer.name, streamerData.thumbnail_url)
                    .setColor(Colours.Purple)
                    .setThumbnail(streamerData.thumbnail_url)
                    .setDescription(`**[${stream.title}](https://twitch.tv/${stream.user_login})**`)
                    .addFields([
                        { name: 'Game', value: stream.game_name, inline: true },
                        { name: 'Viewers', value: String(stream.viewer_count) || '0', inline: true }
                    ])
                    .setImage(stream.thumbnail_url.replace('{width}', '320').replace('{height}', '180'))
    
                return feedChannel.send({ 
                    content: `${streamer.pings ? streamer.pings.join(' ') : ''}\n` + feedMessage.replace('-embed', '') + ' ' , 
                    embeds: [streamEmbed]
                })
            }
        }
    }
}