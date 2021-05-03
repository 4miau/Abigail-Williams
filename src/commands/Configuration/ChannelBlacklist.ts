import { Command } from 'discord-akairo'
import { Message, TextChannel } from 'discord.js'
import { Repository } from 'typeorm'
import { ChannelBlacklists } from '../../models/ChannelBlacklists'

export default class ChannelBlacklist extends Command {
    public constructor() {
        super('channelblacklist', {
            aliases: ['channelblacklist', 'cblacklist'],
            category: 'Configuration',
            description: [
                {
                    content: 'Blacklists commands from a channel',
                    usage: ['blacklist [#channel]'],
                    examples: ['blacklist #lobby']
                }
            ],
            userPermissions: ['MANAGE_GUILD'],
            ratelimit: 3,
            args: [
                {
                    id: 'channel',
                    type: 'channel',
                }
            ]
        })
    }

    public async exec(message: Message, {channel}: {channel: TextChannel}): Promise<Message> {
        if (!channel) return message.util!.send('You must provide a channel to blacklist.')

        const blacklistRepo: Repository<ChannelBlacklists> = this.client.db.getRepository(ChannelBlacklists)
        const blacklistRecord = await blacklistRepo.find().then(blArr => blArr.find(bl => bl.guild === message.guild.id))

        if (blacklistRecord && !blacklistRecord.channels.includes(channel.id)) {
            blacklistRecord.channels.push(channel.id)
            blacklistRepo.update({ 'guild': message.guild.id }, { channels: blacklistRecord.channels }) //UPDATES 2 WHERE 1
        } else if (!blacklistRecord) {
            let serverBlacklists: string[] = new Array<string>(channel.id)

            blacklistRepo.insert({
                'guild': message.guild.id,
                'channels': serverBlacklists
            })
        } else {
            return message.util!.send('This channel is already blacklisted from commands.')
        }
    }
} 


//TODO: Fix array not pushing