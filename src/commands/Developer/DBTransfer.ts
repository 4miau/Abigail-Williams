import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

export default class DBtransfer extends Command {
    public constructor() {
        super('dbtransfer', {
            aliases: ['dbtransfer', 'dbtransfertemp'],
            category: 'Developer',
            description: {
                content: 'Will transfer all databases to new',
                usage: 'dbtransfer',
                examples: ['dbtransfer'],
            },
            channel: 'guild',
            ownerOnly: true,
            ratelimit: 3
        })
    }

    public async exec(message: Message): Promise<void> {
        for (const guild of this.client.guilds.cache.values()) {
            const streamers = await this.client.settings.get(guild, 'twitch.twitch-streamers', [])
            const twitchChannel = await this.client.settings.get(guild, 'twitch.twitch-feedchannel', '')
            const verificationEnabled = await this.client.settings.get(guild, 'verification.enabled', null)
            const verifiedRole = await this.client.settings.get(guild, 'verification.verified-role', '')
            const unverifiedRole = await this.client.settings.get(guild, 'verification.unverified-role', '')
            const roleGroups = await this.client.settings.get(guild, 'reaction.role-groups', [])
            const modmailChannel = await this.client.settings.get(guild, 'modmail.modmail-channel', '')
            const modmailCategory = await this.client.settings.get(guild, 'modmail.modmail-category', '')
            const modmailSetup = await this.client.settings.get(guild, 'modmail.modmail-hasSetup', null)
            const modmailBlacklist = await this.client.settings.get(guild, 'modmail.modmail-blacklist', [])
            const modRole = await this.client.settings.get(guild, 'modRole', '')
            const currentCount = await this.client.settings.get(guild, 'count.current-count', null)
            const currentSender = await this.client.settings.get(guild, 'count.current-sender', '')
            const startOver = await this.client.settings.get(guild, 'count.start-over', null)
            const countChannel = await this.client.settings.get(guild, 'count.count-channel', '')
            const autoRoles = await this.client.settings.get(guild, 'autoRoles', {})
            const supportRole = await this.client.settings.get(guild, 'modmail.support-role', '')

            if (!streamers.arrayEmpty()) await this.client.settings.set(guild, 'streamers', streamers)
            if (twitchChannel) await this.client.settings.set(guild, 'feed-channel', twitchChannel)
            if (verificationEnabled !== null) await this.client.settings.set(guild, 'verify-enabled', verificationEnabled)
            if (verifiedRole) await this.client.settings.set(guild, 'verified-role', verifiedRole)
            if (unverifiedRole) await this.client.settings.set(guild, 'unverified-role', unverifiedRole)
            if (!roleGroups.arrayEmpty()) await this.client.settings.set(guild, 'role-groups', roleGroups)
            if (modmailChannel) await this.client.settings.set(guild, 'modmail-channel', modmailChannel)
            if (modmailCategory) await this.client.settings.set(guild, 'modmail-category', modmailCategory)
            if (modmailSetup !== null) await this.client.settings.set(guild, 'modmail-completed', modmailSetup)
            if (!modmailBlacklist.arrayEmpty()) await this.client.settings.set(guild, 'modmail-blacklist', modmailBlacklist)
            if (currentCount !== null) await this.client.settings.set(guild, 'current-count', currentCount)
            if (currentSender) await this.client.settings.set(guild, 'current-sender', currentSender)
            if (startOver !== null) await this.client.settings.set(guild, 'reset-count', startOver)
            if (countChannel) await this.client.settings.set(guild, 'count-channel', countChannel)
            if (!autoRoles.isObjectEmpty()) await this.client.settings.set(guild, 'auto-roles', autoRoles)
            if (modRole) await this.client.settings.set(guild, 'mod-role', modRole)
            if (supportRole) await this.client.settings.set(guild, 'support-role', supportRole)


            await this.client.settings.delete(guild, 'twitch-streamers')
            await this.client.settings.delete(guild, 'twitch-feedchannel')
            await this.client.settings.delete(guild, 'twitch.twitch-streamers')
            await this.client.settings.delete(guild, 'twitch.twitch-feedchannel')
            await this.client.settings.delete(guild, 'verification.enabled')
            await this.client.settings.delete(guild, 'verification.verified-role')
            await this.client.settings.delete(guild, 'verification.unverified-role')
            await this.client.settings.delete(guild, 'reaction.role-groups')
            await this.client.settings.delete(guild, 'modmail.modmail-channel')
            await this.client.settings.delete(guild, 'modmail.modmail-category')
            await this.client.settings.delete(guild, 'modmail.modmail-hasSetup')
            await this.client.settings.delete(guild, 'modmail.modmail-blacklist')
            await this.client.settings.delete(guild, 'count.current-count')
            await this.client.settings.delete(guild, 'count.current-sender')
            await this.client.settings.delete(guild, 'count.start-over')
            await this.client.settings.delete(guild, 'count.count-channel')
            await this.client.settings.delete(guild, 'autoRoles')
            await this.client.settings.delete(guild, 'test')

            await message.channel.send(`Done transfering for ${guild.name} (${guild.id})`).then(msg => { setTimeout(() => msg?.delete(), 10000) })
        }
    }
}