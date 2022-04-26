import { Command } from 'discord-akairo'
import { GuildMember, Message } from 'discord.js'

import Threads from '../../models/Thread'

export default class Contact extends Command {
    public constructor() {
        super('contact', {
            aliases: ['contact'],
            category: 'Modmail',
            description: {
                content: 'Allows a staff member to contact a member in the guild through a thread.',
                usage: 'contact [member] [reason]',
                examples: ['contact user There was a misunderstanding', 'contact "new user" There was a misunderstanding'],
            },
            channel: 'guild',
            ratelimit: 3,
            args: [
                {
                    id: 'member',
                    type: 'member',
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

    //@ts-ignore
    userPermissions(message: Message) {
        const modRole = this.client.settings.get(message.guild, 'modRole', '')
        const supportRole = this.client.settings.get(message.guild, 'support-role', '')
        const hasStaffRole = message.member.permissions.has('MANAGE_GUILD', true) || message.member.roles.cache.has(modRole || supportRole)

        if (!hasStaffRole) return 'Staff or Support role required.'
        return null
    }

    public async exec(message: Message, {member, reason}: {member: GuildMember, reason: string}): Promise<Message> {
        //VALIDATION
        if (!member) return message.channel.send('You need to provide a member in the server to contact.')
        if (this.client.openThreads.has(member.user.id)) return message.channel.send('This user currently has an active thread in this server or another server.')

        const modmailSetup: boolean = this.client.settings.get(message.guild, 'modmail-completed', false)
        const prefix: string = this.client.settings.get(message.guild, 'prefix', 'a.')
        if (!modmailSetup) return message.channel.send(`The server currently does not have modmail set-up. Please use the ${prefix}setup command first.`)

        //THREAD CREATION
        this.client.settings.set(message.guild, 'existing-threads', (this.client.settings.get(message.guild, 'open-threads', 0) + 1))
        this.client.openThreads.set(member.user.id, message.guild)

        const threadData = new Threads({
            id: await Threads.countDocuments() + 1,
            guildID: message.guild.id,
            channelID: 'not yet made',

            userID: member.user.id,
            startedInDMs: false,
            startedBy: message.author.id,
            openingMessage: message.id,
            openingReason: reason,

            threadClosed: false,
            createdAt: new Date(message.createdTimestamp)
        })

        await this.client.threadManager.start(threadData, message)
    }
}