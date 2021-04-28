import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

export default class Prune extends Command {
    public constructor() {
        super('prune', {
            aliases: ['prune', 'purge'],
            category: 'Moderation',
            description: [
                {
                    content: 'Deletes a specified amount of messages (up to 100)',
                    usage: 'prune [numberOfMsgs] | ["word"] | -type',
                    examples: ['prune 50', 'prune 10 @user', 'prune 10 "hi"'],
                    flags: ['-text', '-emojis', '-bots', '-images', '-embeds', '-mentions', '-links', '-invites', '-left']
                }
            ],
            userPermissions: ['MANAGE_MESSAGES', 'VIEW_AUDIT_LOG'],
            clientPermissions: ['MANAGE_MESSAGES'],
            ratelimit: 3,
            args: [
                {
                    id: 'messages',
                    type: 'number',
                },
                {
                    id: 'userOrWords',
                    type: 'string',
                },
                {
                    id: 'flags',
                    type: 'string',
                    match: 'phrase'
                }
            ]
        })
    }

    private parseFlags(flags: string): string[] {
        return ['hi']
    }

    public async exec(message: Message, {messages, userOrWords, flags}: {messages: number, userOrWords: string, flags: string}) {
        if (!messages) return message.util!.send('You must have a number of messages to delete!') 
        if (messages < 0 || messages > 100) return message.util!.send('Please input a valid number between 1 - 100.')

        if (flags) {

        }

        console.log(userOrWords)

        if (!userOrWords && !flags) {
            try {
                message.channel.messages.channel.bulkDelete(messages)   
            } catch (err) {
                return message.util!.send('Error deleting messages, please try again')
            }
        } else if (userOrWords) {
            const member = message.guild.members.resolve(userOrWords)
            if (member) {
                message.channel.messages.fetch({ limit: messages})
                    .then(messages => { message.channel.messages.channel.bulkDelete(messages.filter(m => m.author.id === member.id))})
            } else {
                message.channel.messages.fetch({ limit: messages})
                    .then(messages => message.channel.messages.channel.bulkDelete(messages.filter(m => m.content.includes(userOrWords))) )
            }
        }
    }
}

//TODO: COMPLETE FLAGS PARSING

/*
t@prune help | <1-99> [user] | ["word"] | [type] [--ignore [user] | ["word"] | [type]]
text, emojis, bots, images, embeds, mentions, links, invites, left
*/

/*
Flags:
-u *USER*

*/