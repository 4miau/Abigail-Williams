import { Command } from 'discord-akairo'
import { GuildMember, Message } from 'discord.js'

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
            userPermissions: ['MANAGE_MESSAGES', 'VIEW_AUDIT_LOG'],
            clientPermissions: ['MANAGE_MESSAGES'],
            ratelimit: 3,
            args: [
                {
                    id: 'messages',
                    type: 'number'
                },
                {
                    id: 'args',
                    match: 'rest'
                }
            ]
        })
    }

    private parseFlag(message: Message, flag: string): number {
        if (!flag) return 12
        if (message.guild.members.resolve(flag) || message.guild.members.resolve(flag.substring(3, flag.length - 1))) return 10

        flag.startsWith('-') ? flag = flag.substring(1) : void 0
        if (flag.startsWith('"') && flag.endsWith('"')) return 11
        try {
            const matchingFlag = Object.entries(flags).find(e => e[0] === flag)[1]
            if (matchingFlag) return parseInt(matchingFlag.toString())
        } catch {
            return 0 
        }
    }

    public async exec(message: Message, {messages, args}: {messages: number, args: string}): Promise<Message> {
        if (!messages) return message.util!.send('You must have a number of messages to delete!') 
        if (messages < 0) return message.util!.send('Please input a number greater than 0')

        messages >= 100 ? messages = 100 : messages = messages + ONE

        let argCaller: number = 0
        let realMessages: number = 0

        argCaller = this.parseFlag(message, args as string)
        
        const argsFunc = {
            1 : async () => { //Text flag
                await message.channel.messages.fetch({ 'limit': messages })
                    .then(msgCollection =>  {
                        return message.channel.messages.channel.bulkDelete(
                            msgCollection.filter(m => m.attachments.size === 0)) || 
                            msgCollection.filter(m => m.embeds.length === 0
                        )
                }).then(col => realMessages = col.size - 1) //Gets the number of deleted messages
            },
            2 : async () => { //Bots flag
                await message.channel.messages.fetch({ 'limit': messages })
                    .then(msgCollection => message.channel.messages.channel.bulkDelete(msgCollection.filter(m => m.author.bot)))
                    .then(col => realMessages = col.size)
            },
            3 : async () => { //Images flag
                await message.channel.messages.fetch({ 'limit': messages })
                    .then(msgCollection => message.channel.messages.channel.bulkDelete(msgCollection.filter(m => m.attachments.size > 0)))
                    .then(col => realMessages = col.size)
            },
            4 : async () => { //Embeds flag
                await message.channel.messages.fetch({ 'limit': messages })
                    .then(msgCollection => message.channel.messages.channel.bulkDelete(msgCollection.filter(m => m.embeds.length > 0)))
                    .then(col => realMessages = col.size)
            },
            5 : async () => { //Mentions flag
                await message.channel.messages.fetch({ 'limit': messages })
                    .then(msgCollection => message.channel.messages.channel.bulkDelete(msgCollection.filter(m => m.mentions.members.size > 0)))
                    .then(col => realMessages = col.size)
            },
            6 : async () => { //Links flag
                await message.channel.messages.fetch({ 'limit': messages })
                    .then(msgCollection => message.channel.messages.channel.bulkDelete(msgCollection.filter(m => m.content.includes('https://'))))
                    .then(col => realMessages = col.size)
            },
            7 : async () => { //Invites flag
                await message.channel.messages.fetch({ 'limit': messages })
                    .then(msgCollection => message.channel.messages.channel.bulkDelete(
                        msgCollection.filter(m => m.content.includes('discord.gg')) ||
                        msgCollection.filter(m => m.content.includes('.gg/'))
                    ))
                    .then(col => realMessages = col.size)
            },
            8 : async () => { //Left (member left server) flag
                await message.channel.messages.fetch({ 'limit': messages })
                    .then(msgCollection => message.channel.messages.channel.bulkDelete(msgCollection.filter(m => !message.guild.members.resolve(m.author.id))))
                    .then(col => realMessages = col.size)
            },
            9 : async () => { // Member flag (Not bot)
                await message.channel.messages.fetch({ 'limit': messages })
                    .then(msgCollection => message.channel.messages.channel.bulkDelete(msgCollection.filter(m => !m.author.bot)))
                    .then(col => realMessages = col.size)
            },
            10 : async () => { //GuildMember flag (specific guildmember)
                await message.channel.messages.fetch({ 'limit': messages })
                    .then(msgCollection => {
                        const userResolved: GuildMember = args.startsWith('<') ? message.guild.members.resolve(args.substring(3, args.length - 1)) : message.guild.members.resolve(args)
                        return message.channel.messages.channel.bulkDelete(msgCollection.filter(m => m.author.id === userResolved.id))
                    })
                    .then(col => realMessages = col.size)
            },
            11 : async () => { //Words flag
                await message.channel.messages.fetch({ 'limit': messages })
                    .then(msgCollection => message.channel.messages.channel.bulkDelete(msgCollection.filter(m => m.content.includes(args.toString().substring(1, args.toString().length-1)))))
                    .then(col => realMessages = col.size)
            },
            12 : async () => { //No args
                await message.channel.messages.fetch({ 'limit': messages })
                    .then(() => message.channel.messages.channel.bulkDelete(messages))
                    .then(() => realMessages = messages - 1)
            }
        }

        ;(argCaller === 0 ? async () => { //INVALID flag, not member or word(s)
            return await message.util!.send('Please provide a valid flag')
            .then(m => setTimeout(() => {
                m.delete()
            }, 5000))
        } : async () => { //ELSE IS A VALID FLAG
            await argsFunc[argCaller].call('')
            return await message.util!.send(`${realMessages ? realMessages + ' messages have successfully been deleted.' : 'No messages have been deleted.'}`)
                .then(m => {
                    !message.deleted ? message.delete() : void 0
                    setTimeout(() => { m.delete() }, 5000)
                    return m
            })})()
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