import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

import BotStatus from '../../models/BotStatus'
import { miauTwitch } from '../../util/Constants'

export default class Activity extends Command {
    public constructor() {
        super('activity', {
            aliases: ['activity', 'setactivity'],
            category: 'Developer',
            description: {
                    content: 'Sets my activity',
                    usage: 'activity [activity]',
                    examples: ['activity Listening to music']
            },
            ownerOnly: true,
            ratelimit: 3,
            args: [
                {
                    id: 'activityType',
                    type: 'string',
                    match: 'phrase'
                },
                {
                    id: 'activityMsg',
                    type: 'string',
                    match: 'rest'
                },
                {
                    id: 'twitchURL',
                    type: 'string',
                    match: 'option',
                    flag: ['-l']
                }
            ]
        })
    }

    public async exec(message: Message, {activityType, activityMsg, twitchURL} : {activityType: string, activityMsg: string, twitchURL: string}): Promise<Message> {
        if (!activityType) return message.util.send('You need to provide at least an activity type')
        if (!activityMsg) activityMsg = ''
        
        if (await BotStatus.find().then(bsArr => bsArr.length === 0)) {
            await BotStatus.create({ id: 1, presenceType: 'activity', presenceMode: '' })
        }

        switch (activityType.toLocaleLowerCase()) {
            case 'listening':
                this.client.user.setActivity({type: 'LISTENING', name: activityMsg})
                break
            case 'play':
            case 'playing':
                this.client.user.setActivity({type: 'PLAYING', name: activityMsg})
                break
            case 'watch':
            case 'watching':
                this.client.user.setActivity({'type': 'WATCHING', 'name': activityMsg})
                break
            case 'stream':
            case 'streaming':
                this.client.user.setActivity({'type': 'STREAMING', 'name': activityMsg, 'url': twitchURL ? twitchURL : miauTwitch})
                break
            default:
                if (!message.author.bot) return message.util.send('You must supply a valid activity type!')
        }

        await this.updateStatus([ activityType, activityMsg, twitchURL || null])
        if (!message.author.bot) return message.util.send('Successfully changed my presence data.')
    }

    private async updateStatus(data: Array<string>) {
        return BotStatus.updateOne({ id: 1 }, {
            presenceType: 'activity',
            presenceMode: data[0],
            presenceMessage: data[1],
            url: data[0] === 'STREAMING' ? data[2] || miauTwitch : ''
        })
    }
}