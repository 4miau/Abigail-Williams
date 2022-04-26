import { Command } from 'discord-akairo'
import { Message } from 'discord.js'


import BotStatus  from '../../models/BotStatus'
import { miauTwitch } from '../../util/Constants'

export default class Status extends Command {
    public constructor() {
        super('status', {
            aliases: ['status', 'setstatus'],
            category: 'Owner',
            description: {
                    content: 'Sets my status',
                    usage: 'status [status] <message>',
                    examples: ['status dnd', 'status dnd Watching Miau\'s VODs']
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
        if (!status) return message.util.send('You need to provide at least a status type.')
        if (!statusMsg) statusMsg = ''

        if (await BotStatus.find().then(bsArr => bsArr.length === 0)) {
            await BotStatus.create({ id: 1, presenceType: 'status', presenceMode: '', presenceData: '' })
        }

        switch (status.toLocaleLowerCase()) {
            case 'offline':
            case 'invisible':
                this.client.user.setPresence({status: 'invisible', activities: [{ name: statusMsg }] })
                break
            case 'away':
            case 'idle':
                this.client.user.setPresence({ status: 'idle', activities: [{name: statusMsg }] })
                break
            case 'online':
                this.client.user.setPresence({status: 'online', activities: [{name: statusMsg }] })
                break
            case 'donotdisturb':
            case 'dnd':
                this.client.user.setPresence({status: 'dnd', activities: [{name: statusMsg }]})
                break
            case 'stream':
            case 'streaming':
                this.client.user.setPresence({status: 'online', activities: [{ 
                    type: 'STREAMING', 
                    name: statusMsg || 'Check out this Twitch channel!', 
                    url: twitchURL || miauTwitch 
                }]})
                break
            default:
                if (!message.author.bot) return message.util.send('You must supply a valid status type!')
        }

        const isStream = status.caseCompare('stream', 'streaming')

        await this.updateStatus([ isStream ? 'streaming' : status, statusMsg, isStream ? twitchURL || miauTwitch : null ])
        if (!message.author.bot) return message.util.send('Successfully changed my presence data.')
    }

    private async updateStatus(data: Array<string>) {
        return BotStatus.updateOne({ id: 1 }, {
            presenceType: 'status',
            presenceMode: data[0],
            presenceMessage: data[1],
            url: data[0] === 'streaming' ? data[2] || miauTwitch: ''
        })
    }
}