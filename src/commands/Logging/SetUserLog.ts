import { Command } from 'discord-akairo'
import { Message, TextChannel } from 'discord.js'

import { userLogFlags } from '../../util/Constants'

export default class SetUserLog extends Command {
    public constructor() {
        super('setuserlog', {
            aliases: ['setuserlog', 'userlog', 'userlogs'],
            category: 'Logging',
            description: {
                content: 'Sets user log data (channel & type of log) to post. (Leave channel blank to remove the userlog type, all also removes the channel.'
                    + 'Input only a channel to change where logs are posted.)',
                usage: 'userlog [avatar/username/nickname/join/leave/all] [channel]',
                examples: ['userlog avatar #logs', 'userlog avatar'],
            },
            channel: 'guild',
            ownerOnly: true,
            ratelimit: 3,
            args: [
                {
                    id: 'type',
                    type: (_: Message, str: string) => {
                        if (!str) return null
                        if (userLogFlags.includes(str.toLowerCase())) return str.toLowerCase()
                        return null
                    },
                    unordered: true
                },
                {
                    id: 'channel',
                    type: 'textChannel',
                    unordered: true
                }
            ]
        })
    }

    //@ts-ignore
    userPermissions(message: Message) {
        const modRole: string = this.client.settings.get(message.guild, 'modRole', '')
        const hasStaffRole = message.member.hasPermission('ADMINISTRATOR', { checkAdmin: false, checkOwner: true}) || message.member.roles.cache.has(modRole)

        if (!hasStaffRole) return 'Moderator'
        return null
    }

    public async exec(message: Message, {type, channel}: {type: string, channel: TextChannel}): Promise<Message> {
        if (!type && !channel) return message.util!.send('You require a type at least for userlogs.')

        if (channel && !type) {
            this.client.settings.set(message.guild, 'logs.user-logs.channel', channel.id)
            return message.util!.send('I have changed the channel where logs are posted.')
        }

        if (!channel) {
            switch (type) {
                case 'avatar':
                    this.client.settings.delete(message.guild, 'logs.user-logs.avatar')
                    return message.util!.send('I\'ve removed the avatar logs from user logs.')
                case 'username':
                    this.client.settings.delete(message.guild, 'logs.user-logs.username')
                    return message.util!.send('I\'ve removed username changes from user logs.')
                case 'nickname':
                    this.client.settings.delete(message.guild, 'logs.user-logs.nickname')
                    return message.util!.send('I\'ve removed nickname changes from the user logs.')
                case 'join':
                    this.client.settings.delete(message.guild, 'logs.user-logs.joins')
                    return message.util!.send('I\'ve removed user join logs from the user logs.')
                case 'leave':
                    this.client.settings.delete(message.guild, 'logs.user-logs.leaves')
                    return message.util!.send('I\'ve removed user leave logs from the user logs.')
                case 'all':
                    this.client.settings.delete(message.guild, 'logs.user-logs')
                    return message.util!.send('I have completely removed user logs from this server.')
            }
        }

        const manageType = {
            'avatar': async () => {
                this.client.settings.setArr(message.guild, [
                    {key: 'logs.user-logs.avatar', value : true},
                    {key: 'logs.user-logs.channel', value: channel.id}
                ])
                return message.util!.send('I will now post user avatar changes in this channel.')
            },
            'username': async () => {
                this.client.settings.setArr(message.guild, [
                    {key: 'logs.user-logs.username', value : true},
                    {key: 'logs.user-logs.channel', value: channel.id}
                ])
                return message.util!.send('I will now post user avatar changes in this channel.')
            },
            'nickname': async () => {
                this.client.settings.setArr(message.guild, [
                    {key: 'logs.user-logs.nickname', value : true},
                    {key: 'logs.user-logs.channel', value: channel.id}
                ])
                return message.util!.send('I will now post user avatar changes in this channel.')
            },
            'join': async () => {
                this.client.settings.setArr(message.guild, [
                    {key: 'logs.user-logs.join', value : true},
                    {key: 'logs.user-logs.channel', value: channel.id}
                ])
                return message.util!.send('I will now post user avatar changes in this channel.')
            },
            'leave': async () => {
                this.client.settings.setArr(message.guild, [
                    {key: 'logs.user-logs.leave', value : true},
                    {key: 'logs.user-logs.channel', value: channel}
                ])
                return message.util!.send('I will now post user avatar changes in this channel.')
            },
            'all': async () => {
                this.client.logger.log('CAUTION', `${channel}`)
                this.client.settings.setArr(message.guild, [
                    { key: 'logs.user-logs.avatar', value: true },
                    { key: 'logs.user-logs.username', value: true },
                    { key: 'logs.user-logs.nickname', value: true },
                    { key: 'logs.user-logs.join', value: true },
                    { key: 'logs.user-logs.leave', value: true },
                    { key: 'logs.user-logs.channel', value: channel.id}
                ])
                return message.util!.send('I will now post all user changes in this server.')
            }
        }

        return await manageType[type].call()
    }
}
