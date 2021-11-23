import { Command } from 'discord-akairo'
import { Message, TextChannel } from 'discord.js'

export default class AntiSpamWhitelist extends Command {
    public constructor() {
        super('antispamwhitelist', {
            aliases: ['antispamwhitelist'],
            category: 'Automation',
            description: {
                content: 'Dedicates channels that are safe from anti-spam detection. Or removes them from the whitelist.',
                usage: 'antispamwhitelist [channels]',
                examples: ['antispamwhitelist #spam', 'antispamwhitelist #spam #bots'],
            },
            channel: 'guild',
            ratelimit: 3,
            args: [
                {
                    id: 'channels',
                    type: 'textChannels',
                    match: 'restContent'
                }
            ]
        })
    }

    public exec(message: Message, {channels}: {channels: TextChannel[]}): Promise<Message> {
        if (!channels) return message.util.send('You must provide text channels (excluding threads) to add to the whitelist.')
        
        let spamWhitelist: string[] = this.client.settings.get(message.guild, 'automod.antispam-whitelist', [])

        if (spamWhitelist.arrayEmpty()) {
            channels.forEach(async c => {
                spamWhitelist.push(c.id)
                const added = await message.channel.send(`Added ${c.name} to the anti-spam whitelist.`)
                setTimeout(() => added.delete(), 3000)
            })
            this.client.settings.set(message.guild, 'automod.antispam-whitelist', spamWhitelist)
            return message.util.send(`Successfully added ${channels.length} channels to the anti-spam whitelist.`)
        } else {
            let additions = 0
            let subtractions = 0

            channels.forEach(async c => {
                if (spamWhitelist.some(channel => channel === c.id)) {
                   spamWhitelist = spamWhitelist.filter(channel => channel === c.id)
                   subtractions++
                   const removed = await message.channel.send(`Removed ${c.name} from the anti-spam whitelist.`)
                   setTimeout(() => removed.delete(), 3000)
                }
                else {
                    spamWhitelist.push(c.id)
                    additions++
                    const added = await message.channel.send(`Added ${c.name} to the anti-spam whitelist.`)
                    setTimeout(() => added.delete(), 3000)
                }
            })
            this.client.settings.set(message.guild, 'automod.antispam-whitelist', spamWhitelist)
            return message.util.send(`Successfully added ${additions} channels and subtracted ${subtractions} channels from the anti-spam whitelist.`)
        }
    }
}