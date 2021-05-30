import {  Collection, Guild, GuildMember, Message, MessageReaction, TextChannel, User } from 'discord.js'
import path from 'path'

import type Client from '../client/BotClient'
import { Stars } from '../models/Stars'
import { Colours } from '../util/Colours'
import { extensions } from '../util/Constants'
import Queue from './QueueManager'

export default class Starboard {
    protected client: Client
    protected guild: Guild
    protected queues: Collection<string, any> = new Collection<string, any>()
    public reactionsRemoved = new Set<string>()

    public constructor(client: Client, guild: Guild) {
        this.client = client
        this.guild = guild
    }

    get channel() { return this.guild.channels.cache.get(this.client.settings.get(this.guild, 'starboard.starboardChannelID', '')) as TextChannel }

    get threshold() { return this.client.settings.get(this.guild, 'starThreshold', 1) }

    public queue(message: Message, promise: any): Promise<any> {
        let queue = this.queues.get(message.id)
        if (!queue) {
            this.queues.set(message.id, new Queue(this.client))
            queue = this.queues.get(message.id)
        }

        return new Promise(resolve => {
            queue.add(() => promise().then((res: any) => {
                if (!queue.length) this.queues.delete(message.id)
                resolve(res)
            }))
        })
    }

    public addStarQueue(message: Message, starredBy: User) {
        //CHECKING IF ADDITION OF STAR IS VALID
        const UserBlacklist: string[] = this.client.settings.get(message.guild, 'starboard.user-blacklist', [])
        const ChannelBlacklist: string[] = this.client.settings.get(message.guild, 'starboard.channel-blacklist', [])

        if (UserBlacklist.includes(starredBy.id)) return `You have been blacklisted from using the starboard.`
        if (ChannelBlacklist.includes(message.channel.id)) return `This channel has been blacklisted from the starboard`

        if (!this.channel) {
            const prefix: string = this.client.settings.get(this.guild, 'prefix', 'a.')
            return `There isn\'t a starboard channel configured, you can set one by using the \`${prefix}starboardsetchannel\` command.`
        }

        if (message.author.id === starredBy.id) return `You can\'t star your own messages.`

        return this.queue(message, () => this.addStar(message, starredBy))
    }

    private async addStar(message: Message, starredBy: User) {
        //ADDING STAR TO DB
        const starRepo = this.client.db.getRepository(Stars)
        const star = await starRepo.findOne({ where: { message: message.id }})

        if (!star) {
            const starboardMessage = this.threshold === 1 ? await this.channel.send({ embed: this.buildStarboardEmbed(message)}) : null

            starRepo.save({
                message: message.id,
                author: message.author.id,
                channel: message.channel.id,
                guild: message.guild.id,
                starboardMessage: starboardMessage.id ? starboardMessage.id : null,
                starredBy: [starredBy.id],
                starCount: 1
            })

            return undefined
        }

        if (star.starredBy.includes(starredBy.id)) return 'You have already starred this message before; You can\'t star it again.'

        const newStarredBy = star.starredBy.concat([starredBy.id])
        let starboardMessage: Message

        if (newStarredBy.length >= this.threshold) {
            const e = this.buildStarboardEmbed(message, newStarredBy.length)

            starboardMessage = star.starboardMessage ? 
                await this.channel.messages.fetch(star.starboardMessage).then(msg => msg.edit(e)).catch(() => this.channel.send(e))
                :
                await this.channel.send(e)
        }

        await starRepo.update(star, {
            starCount: newStarredBy.length,
            starredBy: newStarredBy,
            starboardMessage: starboardMessage ? starboardMessage.id : null
        })

        return undefined
    }

    public async removeStarQueue(message: Message, unstarredBy: User) {
        //CHECKING IF REMOVAL OF STAR IS VALID
        const UserBlacklist: string[] = this.client.settings.get(message.guild, 'starboard.user-blacklist', [])
        const ChannelBlacklist: string[] = this.client.settings.get(message.guild, 'starboard.channel-blacklist', [])

        if (UserBlacklist.includes(unstarredBy.id)) return `You have been blacklisted from using the starboard.`
        if (ChannelBlacklist.includes(message.channel.id)) return `This channel has been blacklisted from the starboard`

        if (!this.channel) return undefined

        return this.queue(message, () => this.removeStar(message, unstarredBy))
    }

    private async removeStar(message: Message, unstarredBy: User) {
        //REMOVING STAR FROM DB
        const starRepo = this.client.db.getRepository(Stars)
        const star = await starRepo.findOne({ where: { message: message.id } })

        if (!star || !star.starredBy.includes(unstarredBy.id)) return undefined

        const emojiID = this.client.settings.get(message.guild, 'starboard.emoji', '⭐')
        if (message.reactions.cache.has(emojiID)) {
            const reaction = message.reactions.cache.get(emojiID)
            if (reaction.users.cache.has(unstarredBy.id)) {
                await reaction.users.remove(unstarredBy.id).then(() => { this.reactionsRemoved.add(reaction.message.id)}).catch(null)
            }
        }

        const newStarredBy = star.starredBy.filter(id => id !== unstarredBy.id)
        if (newStarredBy.length) {
            let starboardMessage: Message
            if (newStarredBy.length >= this.threshold) {
                const e = this.buildStarboardEmbed(message, newStarredBy.length)
                starboardMessage = star.starboardMessage ?
                await this.channel.messages.fetch(star.starboardMessage).then(msg => msg.edit(e)).catch(() => this.channel.send(e))
                :
                await this.channel.send(e)
            }
            else {
                const msg = await this.channel.messages.fetch(star.starboardMessage).catch(null)
                if (msg) await msg.delete()
            }

            await starRepo.update(star, {
                starCount: newStarredBy.length,
                starredBy: newStarredBy,
                starboardMessage: starboardMessage ? starboardMessage.id : null
            })

            return undefined
        }
    }

    public deleteStarQueue(message: Message) {
        //CHECK IF DELETE IS VALID
        if (!this.channel) return undefined

        return this.queue(message, () => this.deleteStar(message))
    }

    private async deleteStar(message: Message) {
        //DELETE STAR ENTITY FROM DB
        const starRepo = this.client.db.getRepository(Stars)
        const star = await starRepo.findOne({ where: { message: message.id} })

        if (!star) return undefined

        const starboardMessage = star.starboardMessage && await this.channel.messages.fetch(star.starboardMessage).catch(null)

        if (starboardMessage) await starboardMessage.delete()

        await starRepo.delete(star)
        return undefined
    }

    public async fixStar(message: Message) {
        //FIX STAR IN DB
        const starRepo = this.client.db.getRepository(Stars)
        const star = await starRepo.findOne({ where: { message: message.id} })

        const UserBlacklist = this.client.settings.get(message.guild, 'starboard.user-blacklist', [])

        const fetchUsers = (reaction: MessageReaction): Collection<string, User> => {
            const users = this.client.util.collection()
            let prevAmount = 0

            const fetch = async (after: string) => {
                const fetched = await reaction.users.fetch({ after })
                if (fetched.size === prevAmount) return users

                for (const [k, v] of fetched) users.set(k, v)

                prevAmount = fetched.size
                return fetch(fetched.last().id)
            }

            //@ts-ignore
            return fetch()
        }

        const emojiID = this.client.settings.get(message.guild, 'starboard.emoji', '⭐')

        if (!star) {
            if (!message.reactions.cache.has(emojiID)) return undefined

            const users = fetchUsers(message.reactions.cache.get(emojiID))
            const starredBy = users
                .map(user => user.id)
                .filter(user => message.author.id !== user && !UserBlacklist.includes(user))

            if (!starredBy.length) return undefined

            let starboardMessage: Message
            if (starredBy.length >= this.threshold) {
                const e = this.buildStarboardEmbed(message, starredBy.length)
                starboardMessage = await this.channel.send(e)
            }
            else if (star.starboardMessage) {
                const msg = await this.channel.messages.fetch(star.starboardMessage).catch(null)
                if (msg) await msg.delete()
            }

            starRepo.create({
                starredBy: starredBy,
                message: message.id,
                author: message.author.id,
                channel: message.channel.id,
                guild: message.guild.id,
                starboardMessage: starboardMessage ? starboardMessage.id : null,
                starCount: starredBy.length
            })

            return undefined
        }

        const users = message.reactions.cache.has(emojiID) ? 
        fetchUsers(message.reactions.cache.get(emojiID))
        :
        this.client.util.collection()

        const newStarredBy = (users as Collection<string, GuildMember>)
            .map(user => user.id)
            .filter(user => !star.starredBy.includes(user) && message.author.id !== user && !UserBlacklist.includes(user))
            .concat(star.starredBy)

        let starboardMessage: Message
        if (newStarredBy.length >= this.threshold) {
            const e = this.buildStarboardEmbed(message, newStarredBy.length)
            starboardMessage = star.starboardMessage ?
            await this.channel.messages.fetch(star.starboardMessage).then(msg => msg.edit(e)).catch(() => this.channel.send(e))
            :
            await this.channel.send(e)
        }
        else {
            const msg = await this.channel.messages.fetch(star.starboardMessage).catch(null)
            if (msg) await msg.delete()
        }

        await starRepo.update(star, {
            starCount: newStarredBy.length,
            starredBy: newStarredBy,
            starboardMessage: starboardMessage ? starboardMessage.id : null,
        })

        return undefined
    }

    public destroy() {
        const starRepo = this.client.db.getRepository(Stars)
        return starRepo.delete({ guild: this.guild.id })
    }

    public buildStarboardEmbed(message: Message, starCount = 1) {
        const star = Starboard.getStarEmoji(starCount)
        const e = this.client.AbbyUtil.embed()
            .setColor(Colours.Supernova)
            .addField('Author', message.author, true)
            .addField('Channel', message.channel, true)
            .setThumbnail(message.author.displayAvatarURL({ dynamic: true, format: 'png' }))
            .setFooter(`${star} ${starCount} | ${message.id}`)

        if (message.content) {
            let content = message.content.substring(0, 1000)
            if (message.content.length > 1000) content += '...'
            e.addField('Message', content)
        }

        e.addField('Message', `[Jump To](${message.url})`)
            
        return e
    }

    public static getStarEmoji(count: number) {
		if (count < 5) return '⭐';
		if (count < 10) return '🌟';
		if (count < 15) return '✨';
		if (count < 20) return '💫';
		if (count < 30) return '🎇';
		if (count < 40) return '🎆';
		if (count < 50) return '☄️';
		if (count < 75) return '🌠';
		if (count < 100) return '🌌';
		if (count < 150) return '🌌•⭐';
		if (count < 200) return '🌌•🌟';
		if (count < 300) return '🌌•✨';
		if (count < 400) return '🌌•💫';
		if (count < 650) return '🌌•🎇';
		if (count < 900) return '🌌•🎆';
		if (count < 1400) return '🌌•☄️';
		if (count < 2400) return '🌌•🌠';
		return '🌌•🌌';
	}

    public static emojiFromID(client, id) {
		if (/^\d+$/.test(id)) {
			return client.emojis.get(id);
		}

		return id;
	}

    public static getAttachment(message: Message) {
        const exts = extensions
        const link = /https?:\/\/(?:\w+\.)?[\w-]+\.[\w]{2,3}(?:\/[\w-_.]+)+\.(?:png|jpg|jpeg|gif)/

        const e = message.embeds.find(e => e.image && exts.includes(path.extname(e.image.url))) 
        if (e) return e.image.url

        const a = message.attachments.find(file => extensions.includes(path.extname(file.url)))
        if (a) return a.url

        const linkMatch = message.content.match(link)
        if (linkMatch && exts.includes(path.extname(linkMatch[0]))) return linkMatch[0]

        return null
    }

    static emojiEquals(x: any, y: any) {
		if (typeof x === 'string' && typeof y === 'string') return x === y
		if (typeof x === 'string') return x === y.name
		if (typeof y === 'string') return x.name === y

		return x.identifier === y.identifier;
	}
}