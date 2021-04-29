import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

import { miauTwitch } from '../../utils/Constants'

export default class Status extends Command {
    public constructor() {
        super('status', {
            aliases: ['status', 'setstatus'],
            category: 'Owner',
            description: [
                {
                    content: 'Sets my status',
                    usage: 'status [status]',
                    examples: ['status dnd']
                }
            ],
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
                    match: 'restContent'
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
            switch (status.toLowerCase()) {
                case 'off':
                case 'offline':
                case 'invisible':
                case 'invis':
                    this.client.user.setPresence({'status': 'invisible', 'activity': {name: statusMsg ? statusMsg : ''}})
                    break
                case 'on':
                case 'online':
                    this.client.user.setPresence({'status': 'online', 'activity': {name: statusMsg ? statusMsg : ''}})
                    break
                case 'away':
                case 'idle':
                    this.client.user.setPresence({'status': 'idle', 'activity': {name: statusMsg ? statusMsg : ''}})
                    break
                case 'dnd':
                case 'donotdisturb':
                    this.client.user.setPresence({'status': 'dnd', 'activity': {name: statusMsg ? statusMsg : ''}})
                    break
                case 'streaming':
                case 'stream':
                    if (statusMsg) {
                        await this.client.user.setPresence({'activity': {'type': 'STREAMING' ,name: statusMsg ? statusMsg : '', url: twitchURL ? twitchURL : miauTwitch }})
                    } else {
                        return message.util!.send('You must accompany a message when setting my status as streaming!')
                    } 
                    break
                default:
                    return message.util!.send('This is not a valid activity!')
            }
            
            return message.util!.send('Completed.')
        }
    }
}

