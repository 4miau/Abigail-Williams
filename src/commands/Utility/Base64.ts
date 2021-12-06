import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

export default class Base64 extends Command {
    public constructor() {
        super('base64', {
            aliases: ['base64'],
            category: 'Utility',
            description: {
                content: 'Encode and decode strings using base64.',
                usage: 'base64 [encode/decode] [string]',
                examples: ['base64 encode miau', 'base64 decode miau'],
            },
            channel: 'guild',
            ratelimit: 3,
            args: [
                {
                    id: 'encodeType',
                    type: (_: Message, str: string) => { return str.caseCompare('encode', 'decode') ? str.toLocaleLowerCase() : undefined },
                    match: 'phrase'
                },
                {
                    id: 'content',
                    type: 'string',
                    match: 'rest'
                }
            ]
        })
    }

    public exec(message: Message, { encodeType, content }: { encodeType: 'encode' | 'decode', content: string }): Promise<Message> {
        if (!encodeType) return message.channel.send('The first argument must be `encode`, or `decode`.')
        if (!content) return message.channel.send('I have nothing to encode or decode.')

        if (encodeType === 'encode') {
            const encodedString = Buffer.from(content, 'binary').toString('base64')
            return message.channel.send(encodedString)
        } else {
            const decodedString = Buffer.from(content, 'base64').toString('binary')
            return message.channel.send(decodedString)
        }
    }
}