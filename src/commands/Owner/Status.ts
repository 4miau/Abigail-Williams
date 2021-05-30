import { Command } from 'discord-akairo'
import { Message } from 'discord.js'
import { Repository } from 'typeorm'


import { BotStatus } from '../../models/BotStatus'
import { miauTwitch } from '../../util/PersonalConstants'

export default class Status extends Command {
    public constructor() {
        super('status', {
            aliases: ['status', 'setstatus'],
            category: 'Owner',
            description: {
                    content: 'Sets my status',
                    usage: 'status [status]',
                    examples: ['status dnd']
            },
            ownerOnly: true,
            ratelimit: 3,
            args: [
                {
                    id: 'status',
                    type: 'string',
                    match: 'phrase'
                },
                {
                    id: 'statusMsg',
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

    public async exec(message: Message, {status, statusMsg, twitchURL}: {status: string, statusMsg: string, twitchURL: string}): Promise<Message> {
        if (status) {
            const statusRepo: Repository<BotStatus> = this.client.db.getRepository<BotStatus>(BotStatus)
            if (await statusRepo.find().then(bsArr => bsArr.length === 0)) {
                statusRepo.insert({
                    'id': 1,
                    'type': 'online',
                    'status': '',
                    'url': '' 
                })
            }

            switch (status.toLowerCase()) {
                case 'off':
                case 'offline':
                case 'invisible':
                case 'invis':
                    this.client.user.setPresence({status: 'invisible', activity: {name: statusMsg ? statusMsg : ''}})
                    await statusRepo.update({ 'id': 1 }, { //UPDATE 2 WHERE 1 (only 1 entry, ID always = 1)
                        'type' : 'status',
                        'activityType': 'invisible',
                        'status': statusMsg ? statusMsg : '',
                    }) 
                    break
                case 'on':
                case 'online':
                    this.client.user.setPresence({status: 'online', activity: {name: statusMsg ? statusMsg : ''}})
                    await statusRepo.update({ 'id': 1 }, {
                        'type' : 'status',
                        'activityType': 'online',
                        'status': statusMsg ? statusMsg : ''
                    }) 
                    break
                case 'away':
                case 'idle':
                    this.client.user.setPresence({status: 'idle', activity: {name: statusMsg ? statusMsg : ''}})
                    await statusRepo.update({ 'id': 1 }, {
                        'type' : 'status',
                        'activityType': 'idle',
                        'status': statusMsg ? statusMsg : ''
                    }) 
                    break
                case 'dnd':
                case 'donotdisturb':
                    this.client.user.setPresence({'status': 'dnd', activity: {name: statusMsg ? statusMsg : ''}})
                    await statusRepo.update({ 'id': 1 }, {
                        'type' : 'status',
                        'activityType': 'dnd',
                        'status': statusMsg ? statusMsg : ''
                    }) 
                    break
                case 'streaming':
                case 'stream':
                    if (statusMsg) {
                        await this.client.user.setPresence({activity: {type: 'STREAMING', name: statusMsg ? statusMsg : '', url: twitchURL ? twitchURL : miauTwitch }})
                        await statusRepo.update({ 'id': 1 }, {
                            type: 'activity',
                            status: statusMsg ? statusMsg : '',
                            url: twitchURL ? twitchURL : miauTwitch
                        })
                    } else {
                        if (!message.author.bot) return message.util!.send('You must accompany a message when setting my status as streaming!')
                    } 
                    break
                default:
                    if (!message.author.bot) return message.util!.send('This is not a valid status!')
            }
            
            if (!message.author.bot) return message.util!.send(`${statusMsg ? 'I have set my status to ' + statusMsg : 'I am now on ' + status}`)
        }
    }
}

