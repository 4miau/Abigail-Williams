import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

import { miauTwitch } from '../../utils/Constants'

export default class Activity extends Command {
    public constructor() {
        super('activity', {
            aliases: ['activity', 'setactivity'],
            category: 'Owner',
            description: [
                {
                    content: 'Sets my activity',
                    usage: 'activity [activity]',
                    examples: ['activity Listening to music']
                }
            ],
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
        if (activityType) {
            switch (activityType.toLowerCase()) {
                case 'listening':
                    this.client.user.setActivity({'type': 'LISTENING', 'name': activityMsg ? activityMsg : ''})
                    break
                case 'playing':
                case 'play':
                    this.client.user.setActivity({'type': 'PLAYING', 'name': activityMsg ? activityMsg : ''})
                    break
                case 'watching':
                case 'watch':
                    this.client.user.setActivity({'type': 'WATCHING', 'name': activityMsg ? activityMsg : ''})
                    break
                case 'streaming':
                case 'stream':
                    this.client.user.setActivity({'type': 'STREAMING', 'name': activityMsg ? activityMsg : '', 'url': twitchURL ? twitchURL : miauTwitch})
                    break
                case 'custom':
                    this.client.user.setActivity({'type': 'CUSTOM_STATUS', 'name': activityMsg ? activityMsg : ''})
                    break
                case 'competing':
                case 'compete':
                    await this.client.user.setActivity({'type': 'COMPETING', 'name': activityMsg ? activityMsg : ''})
                    break
                default:
                    return message.util!.send('You must supply an activity type!')
            }

            return message.util!.send('Completed.')
        }
    }
}