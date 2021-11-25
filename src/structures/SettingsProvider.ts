import { Provider } from 'discord-akairo'
import { Guild } from 'discord.js'

import Settings from '../models/Settings'

export default class SettingsProvider extends Provider {
    public model: typeof Settings

    public constructor(model: typeof Settings) {
        super()
        this.model = model
    }

    public async init() {
        try {
            const guilds =  await this.model.find()
        
            for (const i in guilds) {
                const guild = guilds[i]
                this.items.set(guild.id, guild.settings)
            }
        } catch (err) {
            console.log(err)
        }
    }

    public get<T>(guild: string | Guild, key: string, defaultValue: any): T | any {
        const id = (this.constructor as typeof SettingsProvider).getGuildID(guild)

        if (this.items.has(id)) {
            const value = this.items.get(id)[key]
            return !value ? defaultValue : value
        }

        return defaultValue
    }

    public getArr<T>(guild: string | Guild, props: { key: string, defaultValue: any}[]): T | any {
        const id = (this.constructor as typeof SettingsProvider).getGuildID(guild)

        let propsArr = []

        for (const prop of props) {
            if (this.items.has(id)) {
                const value = this.items.get(id)[prop.key]
                propsArr.push(value || prop.defaultValue)
            }
        }

        if (propsArr) return propsArr

        return props
    }

    public async set(guild: string | Guild, key: string, value: any) {
        const id = (this.constructor as typeof SettingsProvider).getGuildID(guild)
        const data = this.items.get(id) || {}

        data[key] = value
        this.items.set(id, data)

        const doc = await this.getDocument(id)
        doc.settings[key] = value
        return doc.updateOne(doc)
    }

    public async setArr(guild: string | Guild, props: { key: string, value: any }[]) {
        const id = (this.constructor as typeof SettingsProvider).getGuildID(guild)
        const data = this.items.get(id) || {}

        const doc = await this.getDocument(id)

        for (const prop of props) {
            data[prop.key] = prop.value
            this.items.set(id, data)
            doc.settings[prop.key] = prop.value
        }

        return doc.updateOne(doc)
    }

    public async delete(guild: string | Guild, key: string) {
        const id = (this.constructor as typeof SettingsProvider).getGuildID(guild)
        const data = this.items.get(id) || {}
        delete data[key]

        const doc = await this.getDocument(id)
        delete doc.settings[key]
        return doc.updateOne(doc)
    }

    public async deleteArr(guild: string | Guild, keys: string[]) {
        const id = (this.constructor as typeof SettingsProvider).getGuildID(guild)
        const data = this.items.get(id) || {}

        const doc = await this.getDocument(id)

        for (const key of keys) {
            delete data[key]
            delete doc.settings[key]
        }

        return doc.updateOne(doc)
    }

    public async clear(guild: string | Guild) {
        const id = (this.constructor as typeof SettingsProvider).getGuildID(guild)
        this.items.delete(id)

        const doc = await this.getDocument(id)
        if (doc) await doc.remove()
    }

    public async getDocument(id: string) {
        const obj = await this.model.findOne({ id })

        if (!obj) {
            const newDoc = await new this.model({ id, settings: {}}).save()
            return newDoc
        }

        return obj
    }
    
    public static getGuildID(guild: string | Guild): string {
        if (guild instanceof Guild) return guild.id
        if (guild === 'global' || guild === null) return '0'
        if (typeof guild === 'string' && /^\d+$/.test(guild)) return guild

        throw new TypeError('Guild instance is undefined. The valid instances would be: guildID, \'global\' or null')
    }
}