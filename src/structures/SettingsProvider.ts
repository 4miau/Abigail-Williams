import { Provider } from 'discord-akairo'
import { Guild } from 'discord.js'
import { Repository, InsertResult, DeleteResult } from 'typeorm'
import * as _ from 'dot-prop'

import { Settings } from '../models/Settings'

export default class SettingsProvider extends Provider {
    protected repo: Repository<any>

    public constructor(repository: Repository<any>) {
        super()
        this.repo = repository
    }

    public async init() {
        const settings = await this.repo.find()

        for (const setting of settings) this.items.set(setting.guild, JSON.parse(setting.settings))
    }

    public get<T>(guild: string | Guild, key: string, defaultValue: any): T | any {
        const id = (this.constructor as typeof SettingsProvider).getGuildID(guild)
        const data = this.items.get(id)

        if (this.items.has(id)) {
            return _.get(data, key, defaultValue)
        }

        return defaultValue
    }

    public getArr<T>(guild: string | Guild, props: {key: string, defaultValue: any}[]): T | any {
        const id = (this.constructor as typeof SettingsProvider).getGuildID(guild)
        const data = this.items.get(id)

        let propsArr = []

        for(const prop of props) {
            if (this.items.has(id)) {
                propsArr.push(_.get(data, prop.key, prop.defaultValue))
            }  
        } 

        if (propsArr) return propsArr

        return props
    }

    public getRaw(guild: string | Guild): string {
        const id = (this.constructor as typeof SettingsProvider).getGuildID(guild)

        return this.items.get(id)
    }

    public set(guild: string | Guild, key: string, value: any): Promise<InsertResult> {
        const id = (this.constructor as typeof SettingsProvider).getGuildID(guild)
        const data = this.items.get(id) || {}

        _.set(data, key, value)

        this.items.set(id, data)

        return this.repo
            .createQueryBuilder()
            .insert()
            .into(Settings)
            .values({
                'guild': id,
                'settings': JSON.stringify(data)
            })
            .onConflict('("guild") DO UPDATE SET "settings" = :settings')
            .setParameter('settings', JSON.stringify(data))
            .execute()
    }

    public setArr(guild: string | Guild, props: {key: string, value: any}[]): Promise<InsertResult> {
        const id = (this.constructor as typeof SettingsProvider).getGuildID(guild)
        const data = this.items.get(id) || {}

        for(const prop of props) {
            _.set(data, prop.key, prop.value)
        }

        this.items.set(id, data)

        return this.repo
            .createQueryBuilder()
            .insert()
            .into(Settings)
            .values({
                'guild': id,
                'settings': JSON.stringify(data)
            })
            .onConflict('("guild") DO UPDATE SET "settings" = :settings')
            .setParameter('settings', JSON.stringify(data))
            .execute()

    }

    public delete(guild: string | Guild, key: string): Promise<DeleteResult> {
        const id = (this.constructor as typeof SettingsProvider).getGuildID(guild)
        const data = this.items.get(id) || {}

        _.delete(data, key)

        return this.repo
        .createQueryBuilder()
        .insert()
        .into(Settings)
        .values({
            'guild': id,
            'settings': JSON.stringify(data)
        })
        .onConflict('("guild") DO UPDATE SET "settings" = :settings')
        .setParameter('settings', JSON.stringify(data))
        .execute()
    }

    public clear(guild: string | Guild): Promise<DeleteResult> {
        const id = (this.constructor as typeof SettingsProvider).getGuildID(guild)

        this.items.delete(id)
        return this.repo.delete(id)
    }

    public static getGuildID(guild: string | Guild): string {
        if (guild instanceof Guild) return guild.id
        if (guild === 'global' || guild === null) return '0'
        if (typeof guild === 'string' && /^\d+$/.test(guild)) return guild

        throw new TypeError(`Guild instance is undefined. The valid instances would be: guildID, 'global' or null`)
    }
}