import { Argument, Command } from 'discord-akairo'
import { Guild, Message } from 'discord.js'

import Threads from '../../models/Threads'

export default class StartThread extends Command {
    public constructor() {
        super('startthread', {
            aliases: ['startthread', 'new-ticket', 'ticket', 'thread', 'new-thread'],
            category: 'Modmail',
            description: {
                    content: 'Starts a new thread in a server. Guild must either be 1 word or use speech marks e.g. "Bunny Cartel". Using "home" will default to my home server.',
                    usage: 'startthread [guild/\'home\'] <reason>',
                    examples: ['startthread "bunny cartel"', 'ticket epicGuild I need help!', 'new-thread home I require assistance']
            },
            ownerOnly: true,
            channel: 'dm',
            ratelimit: 3,
            args: [
                {
                    id: 'guild',
                    type: Argument.union('guild', 'string'),
                    match: 'phrase'
                },
                {
                    id: 'reason',
                    type: 'string',
                    match: 'rest'
                }
            ]
        })
    }

    public async exec(message: Message, {guild, reason}): Promise<Message> {
        //VALIDATION
        if (!guild) return message.channel.send('You need to at least provide a guild to start a thread in.')
        if (guild === 'home') guild = this.client.abbyHomeServer
        if (typeof guild !== 'object') return message.channel.send('Must be a guild or \'home\'.')

        if (!(guild as Guild).members.cache.has(message.author.id)) return message.channel.send('You must be in this server to start a thread in it. Use ID if necessary.')

        const modmailBlacklist: string[] = this.client.settings.get(guild, 'modmail.modmail-blacklist', [])
        if (modmailBlacklist.includes(message.author.id)) return message.channel.send('You are blacklisted from making modmail requests in this server.')

        if (this.client.openThreads.has(message.author.id)) return message.channel.send('You are currently on a cooldown and can not make a thread yet.')

        const modMailSetup: boolean = this.client.settings.get(guild, 'modmail.modmail-hasSetup', false)
        if (!modMailSetup) return message.channel.send('This server does not have modmail set-up. Please contact staff directly!')

        //THREAD CREATION
        this.client.settings.set(guild, 'modmail.existingThreads', (this.client.settings.get(guild, 'modmail.open-threads', 0) + 1))
        this.client.openThreads.set(message.author.id, guild)

        const threadData = new Threads({
            id: await Threads.countDocuments() + 1,
            guildID: guild.id,
            channelID: 'not yet made',

            userID: message.author.id,
            startedBy: message.author.id,
            openingMessage: message.id,
            openingReason: reason,

            threadClosed: false,
            createdAt: new Date(message.createdTimestamp)
        })

        await this.client.threadManager.start(threadData, message)
    }
}