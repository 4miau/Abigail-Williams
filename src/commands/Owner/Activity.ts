import { Command } from 'discord-akairo'
import { Message } from 'discord.js'
import { Repository } from 'typeorm'

import { BotStatus } from '../../models/BotStatus'
import { miauTwitch } from '../../util/PersonalConstants'

export default class Activity extends Command {
    public constructor() {
        super('activity', {
            aliases: ['activity', 'setactivity'],
            category: 'Owner',
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
        if (activityType) {
            const statusRepo: Repository<BotStatus> = this.client.db.getRepository<BotStatus>(BotStatus)
            if (await statusRepo.find().then(bsArr => bsArr.length === 0)) {
                statusRepo.insert({
                    'id': 1,
                    'type': 'online',
                    'status': '',
                    'url': '' 
                })
            }
            
            switch (activityType.toLowerCase()) {
                case 'listening':
                    this.client.user.setActivity({'type': 'LISTENING', 'name': activityMsg ? activityMsg : ''})
                    await statusRepo.update({ 'id': 1 }, {
                        'type' : 'activity',
                        'activityType': 'LISTENING',
                        'status': activityMsg ? activityMsg : ''
                    }) 
                    break
                case 'playing':
                case 'play':
                    this.client.user.setActivity({'type': 'PLAYING', 'name': activityMsg ? activityMsg : ''})
                    await statusRepo.update({ 'id': 1 }, {
                        'type' : 'activity',
                        'activityType': 'PLAYING',
                        'status': activityMsg ? activityMsg : ''
                    }) 
                    break
                case 'watching':
                case 'watch':
                    this.client.user.setActivity({'type': 'WATCHING', 'name': activityMsg ? activityMsg : ''})
                    await statusRepo.update({ 'id': 1 }, {
                        'type' : 'activity',
                        'activityType': 'WATCHING',
                        'status': activityMsg ? activityMsg : ''
                    }) 
                    break
                case 'streaming':
                case 'stream':
                    this.client.user.setActivity({'type': 'STREAMING', 'name': activityMsg ? activityMsg : '', 'url': twitchURL ? twitchURL : miauTwitch})
                    await statusRepo.update({ 'id': 1 }, {
                        'type' : 'activity',
                        'activityType': 'STREAMING',
                        'status': activityMsg ? activityMsg : '',
                        'url': twitchURL ? twitchURL : miauTwitch
                    }) 
                    break
                case 'custom':
                    this.client.user.setActivity({'type': 'CUSTOM_STATUS', 'name': activityMsg ? activityMsg : ''})
                    await statusRepo.update({ 'id': 1 }, {
                        'type' : 'activity',
                        'activityType': 'CUSTOM_STATUS',
                        'status': activityMsg ? activityMsg : ''
                    }) 
                    break
                case 'competing':
                case 'compete':
                    await this.client.user.setActivity({'type': 'COMPETING', 'name': activityMsg ? activityMsg : ''})
                    await statusRepo.update({ 'id': 1 }, {
                        'type' : 'activity',
                        'activityType': 'COMPETING',
                        'status': activityMsg ? activityMsg : '',
                    }) 
                    break
                default:
                    if (!message.author.bot) return message.util!.send('You must supply a valid activity type!')
            }

            if (!message.author.bot) return message.util!.send(`${activityMsg ? 'I have changed my activity to ' + activityType + ' ' + activityMsg : 'My activity remains unchanged.'}`)
        }

        if (!message.author.bot) return message.util!.send('You need to provide at least an activity type')
    }
}