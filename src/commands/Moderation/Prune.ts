import { Argument, Command } from 'discord-akairo'
import { GuildMember, Message, TextChannel } from 'discord.js'

import { flags, ONE } from '../../util/Constants'

export default class Prune extends Command {
    public constructor() {
        super('prune', {
            aliases: ['prune', 'purge'],
            category: 'Moderation',
            description: {
                    content: 'Deletes a specified amount of messages (up to 100)',
                    usage: 'prune [numberOfMsgs] [user] | ["word"] | [type/flag]',
                    examples: ['prune 50', 'prune 10 @user', 'prune 10 "hi"'],
                    flags: ['-text', '-emojis', '-bots', '-images', '-embeds', '-mentions', '-links', '-invites', '-left']
            },
            channel: 'guild',
            ratelimit: 3,
            args: [
                {
                    id: 'messages',
                    type: 'number'
                },
                {
                    id: 'args',
                    type: Argument.union('member', 'string'),
                    match: 'rest'
                }
            ]
        })
    }

    //@ts-ignore
    userPermissions(message: Message) {
        const modRole = this.client.settings.get(message.guild, 'modRole', '')
        const hasStaffRole = message.member.permissions.has(['VIEW_AUDIT_LOG', 'MANAGE_MESSAGES'], true) || message.member.roles.cache.has(modRole)

        if (!hasStaffRole) return 'Moderator'
        return null
    }

    private parseFlag(message: Message, flag: any): number {
        if (!flag) return 12
        if (message.guild.members.resolve(flag) || flag instanceof GuildMember) return 10

        flag = flag.startsWith('-') ? flag.substring(1) : flag
        if (flag.startsWith('"') && flag.endsWith('"')) return 11
        try {
            const matchingFlag = Object.entries(flags).find(e => e[0] === flag)[1]
            if (matchingFlag) return parseInt(matchingFlag.toString())
        } catch {
            return 0 
        }
    }

    public async exec(message: Message, {messages, args}: {messages: number, args: string}): Promise<Message> {
        if (!messages || messages < 0) return message.channel.send('You must have a valid number of messages to delete!') 

        messages = (messages >= 100) ? 100 : messages + ONE

        let argCaller: number = 0
        let totalMsgs: number = 0

        argCaller = this.parseFlag(message, args)
        
        const argsFunc = {
            1 : async () => { //Text flag
                return message.channel.messages.fetch({ 'limit': messages })
                    .then(msgs =>  {
                        return (message.channel as TextChannel).bulkDelete(
                            msgs.filter(m => m.attachments.size === 0)) || 
                            msgs.filter(m => m.embeds.length === 0
                        )
                }).then(col => totalMsgs = col.size) //Gets the number of deleted messages
            },
            2 : async () => { //Bots flag
                return message.channel.messages.fetch({ 'limit': messages })
                    .then(msgs => (message.channel as TextChannel).bulkDelete(msgs.filter(m => m.author.bot)))
                    .then(col => totalMsgs = col.size)
            },
            3 : async () => { //Images flag
                return message.channel.messages.fetch({ 'limit': messages })
                    .then(msgs => (message.channel as TextChannel).bulkDelete(msgs.filter(m => m.attachments.size > 0)))
                    .then(col => totalMsgs = col.size)
            },
            4 : async () => { //Embeds flag
                return message.channel.messages.fetch({ 'limit': messages })
                    .then(msgs => (message.channel as TextChannel).bulkDelete(msgs.filter(m => m.embeds.length > 0)))
                    .then(col => totalMsgs = col.size)
            },
            5 : async () => { //Mentions flag
                return message.channel.messages.fetch({ 'limit': messages })
                    .then(msgs => (message.channel as TextChannel).bulkDelete(msgs.filter(m => m.mentions.members.size > 0)))
                    .then(col => totalMsgs = col.size)
            },
            6 : async () => { //Links flag
                return message.channel.messages.fetch({ 'limit': messages })
                    .then(msgs => (message.channel as TextChannel).bulkDelete(msgs.filter(m => m.content.includes('https://'))))
                    .then(col => totalMsgs = col.size)
            },
            7 : async () => { //Invites flag
                return message.channel.messages.fetch({ 'limit': messages })
                    .then(msgs => (message.channel as TextChannel).bulkDelete(
                        msgs.filter(m => m.content.includes('discord.gg')) ||
                        msgs.filter(m => m.content.includes('.gg/'))
                    ))
                    .then(col => totalMsgs = col.size)
            },
            8 : async () => { //Left (member left server) flag
                return message.channel.messages.fetch({ 'limit': messages })
                    .then(msgs => (message.channel as TextChannel).bulkDelete(msgs.filter(m => !message.guild.members.resolve(m.author.id))))
                    .then(col => totalMsgs = col.size)
            },
            9 : async () => { // Member flag (Not bot)
                return message.channel.messages.fetch({ 'limit': messages })
                    .then(msgs => (message.channel as TextChannel).bulkDelete(msgs.filter(m => !m.author.bot)))
                    .then(col => totalMsgs = col.size)
            },
            10 : async () => { //GuildMember flag (specific guildmember)
                return message.channel.messages.fetch({ 'limit': messages })
                    .then(async msgs => {
                        const gm: GuildMember = typeof args === 'object' ? args : message.guild.members.resolve(args)
                        return (message.channel as TextChannel).bulkDelete(msgs.filter(m => m.author.id === gm.id))
                    })
                    .then(col => totalMsgs = col.size)
            },
            11 : async () => { //Words flag
                return message.channel.messages.fetch({ 'limit': messages })
                    .then(msgs => (message.channel as TextChannel).bulkDelete(msgs.filter(m => m.content.includes(args.toString().substring(1, args.toString().length-1)))))
                    .then(col => totalMsgs = col.size)
            },
            12 : async () => { //No args
                return message.channel.messages.fetch({ 'limit': messages })
                    .then(() => (message.channel as TextChannel).bulkDelete(messages))
                    .then(() => totalMsgs = messages - 1)
            }
        }

        if (!argCaller) {
            setTimeout(() => { message.delete() }, 5000)
            return message.channel.send('Please provide a valid flag.')
                .then(msg => {
                    setTimeout(() => { msg.delete() }, 5000)
                    return msg
                })
        }
        else {
            await argsFunc[argCaller].call()
            return (message.channel.send(
                totalMsgs ? totalMsgs + `${totalMsgs > 1 ? ' messages have successfully been deleted.' : ' messages have been deleted'}` : 'No messages have been deleted'
            ))
            .then(msg => {
                setTimeout(() => { msg.delete() }, 5000)
                return msg
            })
        }
    }
}

/*
Text: anything that is not an embed or image
Bots: any msgs by bots
Images: any msgs including images
Embeds: any msgs that are embeds
Mentions: any msgs that are mentions
Links: any msgs that contain links
Invites: any msgs containing invites (contains discord.gg/ pattern)
Left: any msgs from members who are no longer in the server
*/