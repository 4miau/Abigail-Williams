import { AkairoClient } from 'discord-akairo'
import { Message, Snowflake, Collection } from 'discord.js'
import fs from 'fs'
import moment from 'moment'
import { join } from 'path'
import glob from 'glob'

export const bulkLogsDir = join(__dirname, '..', '..', 'bulkLogs')
export const dmsDir = join(__dirname, '..', '..', 'DMs')
export const threadsDir = join(__dirname, '..', '..', 'Threads')
export const bufferDir = join(__dirname, '..', '..', 'Buffers')
export const src = join(__dirname, '..', '..')

export async function createFileDirs() {
    fs.mkdir(bulkLogsDir, () => void 0)
    fs.mkdir(dmsDir, () => void 0)
    fs.mkdir(threadsDir, () => void 0)
    fs.mkdir(bufferDir, () => void 0)
}

export function fileCount(dir: string) {
    return fs.readdirSync(dir).length || 0
}

export function createDelMsgFile(_: AkairoClient, deletedMessages: Collection<Snowflake, Message>) {
    fs.readdir(bulkLogsDir, (_, files) => {
        const noOfLogs: number = files.length + 1

        fs.writeFile(join(bulkLogsDir, `bulk-log [${noOfLogs}]`), deletedMessages.map(dm => {
            return `[${moment(dm.createdAt).format('YYYY/MM/DD HH:mm:ss')}] ${dm.author.tag} (${dm.author.id}) : ${dm.content}`
        }).join('\n'), error => error)
    })
}

export function appendDMFile(ac: AkairoClient, message: Message) {
    if (ac.isOwner(message.author.id)) return

    fs.readdir(dmsDir, (err) => {
        err ? ac.logger.log('ERROR', `Error Message: ${err}`) : void 0

        fs.appendFile(join(dmsDir, `${message.author.tag}`), 
            `[${moment(message.createdAt).format('YYYY/MM/DD HH:mm:ss')}] ${message.author.tag} (${message.author.id}) : ${message.content}\n`, 
            _ => void 0
        )
    })
}

export async function findFile(file: string, type: string): Promise<string> {
    const typeHandler = {
        'command': async () => {
            const query = glob.sync(join(src, 'commands/**/*'), { sync: false })
            return query.find(c => c.split('/').findLast(f => f.endsWith('.js'))?.caseCompare(`${file}.js`)) || 'Unable to find the file'
        },
        'event': async () => {
            const query = glob.sync(join(src, 'events/**/*'), { sync: false })
            return query.find(c => c.split('/').findLast(f => f.endsWith('.js'))?.caseCompare(`${file}.js`)) || 'Unable to find the file'
        },
        'inhibitor': () => {
            const query = glob.sync(join(src + 'inhibitors/**/*'), { sync: false })
            return query.find(c => c.split('/').findLast(f => f.endsWith('.js'))?.caseCompare(`${file}.js`)) || 'Unable to find the file'
        }
    }

    return typeHandler[type].call()
}

export function extractEvent(file: string): string {
    const f = fs.readFileSync(file, { encoding: 'utf8' })
    return f.substring(f.indexOf('event:') + 8, f.indexOf('category:') - 1).trim().replace('\',', '').toLocaleLowerCase()
}