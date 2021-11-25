import { Message, TextChannel } from 'discord.js'
import ripemd160 from 'ripemd160'

export async function getInput(req: string, chnl: TextChannel): Promise<string> {
    await chnl.send(req)

    try { return (await chnl.awaitMessages({ max: 1, time: 3e5 })).first().content }
    catch { return null }
}

export async function getMsgResponse(msg: Message): Promise<string> {
    const filter = (m: Message) => m.author.id === msg.author.id
    return await msg.channel.awaitMessages({ filter: filter, max: 1, time: 3e4}).then(col => col.first().content).catch(void 0)
}

export function parseURL(str: string): boolean {
    let url: URL

    try {  url = new URL(str) }
    catch { return false }

    return url.protocol === 'http:' || url.protocol === 'https:'
}

export function yesOrNo(content: string): boolean {
    if (content && (/^y(?:e(?:a|s)?)?$/i).test(content)) return true
    else return false
}

export function generateHash(str: string) { return new ripemd160().update(str).digest('base64') }