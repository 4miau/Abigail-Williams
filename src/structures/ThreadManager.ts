import { Message, MessageEmbed, TextChannel, CategoryChannel, MessageAttachment } from 'discord.js'
import type Client from '../client/Abby'
import moment from 'moment'
import { join } from 'path'
import fs from 'fs'
import ms from 'ms'

import Thread, { IThread } from '../models/Threads'
import { Colours } from '../util/Colours'

export default class ThreadManager {
    client: Client
    threads: typeof Thread
    interval!: NodeJS.Timeout
    rate: number

    public constructor(client: Client, threads: typeof Thread, { rate = ms('1h') } = {}) {
        this.client = client
        this.threads = threads
        this.rate = rate
    }

    public async _init() {
        await this._check()
        this.interval = setInterval(this._check.bind(this), this.rate)
    }

    private async _check() {
        const activeThreads = await this.threads.where({ threadClosed: false })

        if (!activeThreads) return

        activeThreads.forEach(async t => {
            if (!this.client.openThreads.has(t.userID) || !(this.client.openThreads.get(t.userID).id === t.guildID)) {
                const guild = this.client.guilds.resolve(t.guildID)

                if (guild) this.reconnect(t)
            }
        })
    }

    public async start(thread: IThread, message: Message) {
        const guild = this.client.guilds.resolve(thread.guildID)
        const prefix: string = this.client.settings.get(guild, 'prefix', 'a.')
        const data: string[] = [
            this.client.settings.get(guild, 'modmail.support-role', ''), 
            this.client.settings.get(guild, 'modmail.modmail-channel', ''), 
            this.client.settings.get(guild, 'modmail.modmail-category', '')
        ]

        if (!data[1] || !data[2]) {
            this.client.openThreads.delete(message.id)
            return 'Something went wrong, please contact a server staff directly.'
        }

        message.channel.send(
            'Hello there! We have received your message. Please wait momentarily while a staff member reaches out to you.\n' + 
            `You can always close the thread by using ${prefix}close (or ${prefix}close-thread) to end the thread.`
        )

        const cat = guild.channels.resolve(data[2]) as CategoryChannel
        const des = await guild.channels.create(`${message.author.tag.replace('#', '-')}`, {
            topic: `New thread for ${message.author.tag}`,
            parent: cat
        })
        .then(d => {
            d.permissionsFor(guild.roles.everyone).remove(['VIEW_CHANNEL', 'SEND_MESSAGES'])
            data[0] ? d.permissionsFor(data[0]).add(['VIEW_CHANNEL', 'SEND_MESSAGES']) : void 0
            return d
        })

        thread.channelID = des.id
        thread.markModified('New thread created')
        await thread.save()

        if (thread.startedBy.length <= 2) {
            const threadEmbed = new MessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setTitle('New modmail thread')
                .setDescription(
                    `Thread started by \`${thread.startedBy[1]}\`\n` +
                    thread.openingReason ? thread.openingReason : 'Member has not supplied a reason to their thread request.'
                )
                .setColor(Colours.Plum)

            const noteEmbed = new MessageEmbed()
                .setAuthor(des.guild.iconURL({ dynamic: true, format: 'png' }))
                .setTitle('Modmail Note')
                .setDescription(`Please use the \`${prefix}send\` command to relay messages back to the user.`)
                .setColor(Colours.Tomato)

            await des.send({ embeds: [threadEmbed] })
            des.send({ embeds: [noteEmbed]})
        }
        else {
            const e = new MessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setTitle('New')

            await des.send({ embeds: [e] })
            //TODO: Complete this behaviour (support member)
        }

        this.createThreadLog(thread)
        await this.collect(thread, des, message)
    }

    private isContact(thread: IThread): boolean {
        return thread.startedBy.length > 2 ? true : false
    }

    public async end(thread: IThread) {
        thread.threadClosed = true
        this.client.settings.set(thread.guildID, 'modmail.existingThreads', (this.client.settings.get(thread.guildID, 'modmail.open-threads', 1) - 1))
        await thread.updateOne(thread)

        const threadChannel = this.client.channels.resolve(thread.channelID) as TextChannel
        const logChannel = this.client.channels.resolve(this.client.settings.get(thread.guildID, 'modmail.modmail-channel', '')) as TextChannel

        if (threadChannel) {
            await threadChannel.delete()
            if (logChannel) {
                const user = this.client.users.resolve(thread.userID)
                const closedBy = this.client.users.resolve(thread.closedBy)
                const logs = fs.readFileSync(join(__dirname, '..', 'Threads', `${user.tag} [${thread.id}]`))

                const e = new MessageEmbed()
                    .setAuthor(`${user.tag} (${user.id})`)
                    .setDescription(`[\`${thread._id}\`](${await this.publishThreadLog(logs, `${user.tag} [${thread.id}]`)}): ${thread.openingReason}`)
                    .setColor(Colours.Tomato)
                    .setFooter(`Thread closed by ${closedBy.tag} (${closedBy.id}) • ${moment(Date.now()).format('YYYY/M/D HH:mm:ss')}`)
        
                logChannel.send({ embeds: [e] })
            }
        }

        setTimeout(async () => { this.client.openThreads.delete(thread.userID) }, 3e4)
    }

    public async reconnect(thread: IThread) {
        console.log('Reached reconnection stage')
        const guild = this.client.guilds.resolve(thread.guildID)

        if (this.client.openThreads.has(thread.userID)) return

        if (!thread.threadClosed && guild && guild.members.cache.has(thread.userID)) {
            const des = guild.channels.resolve(thread.channelID) as TextChannel
            const user = this.client.users.resolve(thread.userID)

            try {
                const reconnection = await user.dmChannel.messages.fetch(thread.openingMessage, { cache: false, force: true }) || 
                await user.createDM().then(dm => dm.send('Reconnecting to thread...'))
                this.client.openThreads.set(thread.userID, guild)
                await this.collect(thread, des, reconnection, true)
            }
            catch (err) {
                if (des) des.send('Unable to reconnect thread with this recipient, they may have left, or disabled their DMs.')
                else if (user) user.dmChannel.send('Unable to reconnect thread with server. Please try making a new thread.')

                console.log(err)
            }
        }
    }

    public collect(thread: IThread, destination: TextChannel, message: Message, reconnect: boolean = false) {
        const user = this.client.users.resolve(thread.userID)
        const dmFilter = (m: Message) => m.author.id === user.id
        const threadFilter = (m: Message) => m.channel.id === destination.id && !m.author.bot
        const dmMessages = message.channel.createMessageCollector({ filter: dmFilter })
        const threadMessages = destination.createMessageCollector({ filter: threadFilter })

        if (reconnect) {
            message.channel.fetch()
            message.channel.messages.cache.filter(msg => msg.author.id === this.client.user.id).first().edit('Connected to thread successfully.')
        }

        const prefix = this.client.settings.get(destination.guild, 'prefix', 'a.')

        return new Promise(() => {
            dmMessages.on('collect', async (m: Message) => { //SENDS MESSAGE FROM DMS TO DESTINATION
                if (m.content.caseCompare(`${prefix}close`, `${prefix}close-thread`)) {
                    message.channel.send(`This thread has been closed by ${m.author.tag} (${m.author.id})`)
                    destination.send(`This thread has been closed by ${m.author.tag} (${m.author.id})`)

                    dmMessages.stop()
                    threadMessages.stop()

                    thread.closedBy = m.author.id
                    thread.updateOne(thread)
                    return this.end(thread)
                }

                const e = new MessageEmbed()
                    .setAuthor(m.author.tag, m.author.displayAvatarURL({ dynamic: true, format: 'png' }))
                    .setDescription(m.content)
                    .setColor(Colours.Supernova)
                    .setFooter(`${m.author.tag} • ${moment(m.createdAt).format('YYYY/MM/DD HH:mm:ss')}`)

                destination.send({ embeds: [e] })
                this.appendThreadLog(thread, m)
                m.react('✅')
            })

            threadMessages.on('collect', async (m: Message) => { //SENDS MESSAGE FROM DESTINATION TO DMS
                if (m.content.caseCompare(`${prefix}close`, `${prefix}close-thread`)) {
                    message.channel.send(`This thread has been closed by ${m.author.tag} (${m.author.id})`)
                    destination.send(`This thread has been closed by ${m.author.tag} (${m.author.id})`)

                    dmMessages.stop()
                    threadMessages.stop()

                    thread.closedBy = m.author.id
                    thread.updateOne(thread)
                    return this.end(thread)
                }
                else if (m.content.toLocaleLowerCase().startsWith(`${prefix}send`)) {
                    const filtered = m.content.split(' ').slice(1).join(' ')

                    const e = new MessageEmbed()
                        .setAuthor(m.author.tag, destination.guild.iconURL({ dynamic: true, format: 'png' }) || m.author.displayAvatarURL({ dynamic: true, format: 'png' }))
                        .setDescription(filtered)
                        .setColor(Colours.Supernova)
                        .setFooter(`${m.member.roles.highest.name} • ${moment(m.createdAt).utcOffset(1).format('YYYY/MM/DD HH:mm:ss')}`)

                    user.send({ embeds: [e] })
                    this.appendThreadLog(thread, m)
                    m.react('✅')
                }
            })
        })
    }

    private async createThreadLog(thread: IThread) {
        const user = this.client.users.resolve(thread.userID)
        const guild = this.client.guilds.resolve(thread.guildID)
        const threadLoc = join(__dirname, '..', 'Threads', `${user.tag} [${thread.id}]`)
        
        fs.writeFile(threadLoc, `New thread in ${guild.name} (${guild.id}) with ${user.tag}.\n`, _ => void 0)
    }

    private async appendThreadLog(thread: IThread, msg: Message) {
        const user = this.client.users.resolve(thread.userID)
        const threadLoc = join(__dirname, '..', 'Threads', `${user.tag} [${thread.id}]`)

        fs.appendFile(threadLoc, 
            `${msg.channel.type !== 'DM' ? `[Staff at ${msg.guild.name}] ` : '' }` + 
            `[${moment(msg.createdAt).format('YYYY/MM/DD HH:mm:ss')}] ${msg.author.tag} (${msg.author.id}) : ${msg.content}\n`,
            _ => void 0
        )
    }

    private async publishThreadLog(buffer: Buffer, name: string) {
        const publishLog = this.client.channels.resolve('868306584378417162') as TextChannel 
        const attachment = new MessageAttachment(buffer, `${name}.txt`)
        const logMessage = await publishLog.send({ files: [attachment] })

        return logMessage.attachments.first().url
    }
}

/*
thread.startedBy:
normal user: [uid, utag],
server admin: [uid, utag, guildid]
*/

//TODO: Optimize