import { Argument, Command } from 'discord-akairo'
import { Message, TextChannel } from 'discord.js'

export default class SetMessageLog extends Command {
    public constructor() {
        super('setmessagelog', {
            aliases: ['setmessagelog', 'messagelog', 'messagelogchannel', 'msglogchannel'],
            category: 'Logging',
            description: {
                content: 'Posts deleted message logs in a designated text channel.',
                usage: 'deletedmessagelogs [channel] <clear>',
                examples: ['messagelogs #messagelogchannel'],
                flags: ['-d (deleted)', '-e (edited)']
            },
            channel: 'guild',
            ratelimit: 3,
            args: [
                {
                    id: 'channel',
                    type: 'channel'
                },
                {
                    id: 'type',
                    type: Argument.union('log')
                },
                {
                    id: 'clear',
                    match: 'flag',
                    flag: 'clear'
                }
            ]
        })
    }

    //@ts-ignore
    userPermissions(message: Message) {
        const modRole: string = this.client.settings.get(message.guild, 'modRole', '')
        const hasStaffRole = message.member.hasPermission(['VIEW_AUDIT_LOG', 'MANAGE_GUILD'], { checkAdmin: true, checkOwner: true}) || message.member.roles.cache.has(modRole)

        if (!hasStaffRole) return 'Moderator'
        return null
    }

    public async exec(message: Message, {channel, type, clear}: {channel: TextChannel, type: string, clear: boolean}): Promise<Message> {
        await message.delete()
        if (!channel) return (await message.util!.send('Please provide a channel for me to post deleted logs in.')).delete({ 'timeout': 5000 })

        const currLogChannels = this.client.settings.getArr(message.guild, [
            {'key': 'logs.deleted-messages', 'defaultValue': ''},
            {'key': 'logs.edited-messages', 'defaultValue': ''},
        ])

        if (clear) {
            switch (type.toLowerCase()) {
                case 'delete':
                    currLogChannels[1] ? await this.client.settings.delete(message.guild, 'logs.edited-messages') : 0
                    return (await message.util!.send('I have currently removed your current deleted message logs channels.')).delete({ 'timeout': 5000})
                case 'edit':
                    currLogChannels[0] ? await this.client.settings.delete(message.guild, 'logs.deleted-messages') : void 0
                    return (await message.util!.send('I have currently removed your current edited message logs channels.')).delete({ 'timeout': 5000})
                default:
                    await this.client.settings.delete(message.guild, 'logs.deleted-messages').catch(void 0)
                    await this.client.settings.delete(message.guild, 'logs.edited-messages').catch(void 0)
                    return (await message.util!.send('I have currently removed your current message log channels.')).delete({ 'timeout': 5000 })
            }
        }

        const setLogs = {
            'delete' : async () => {
                return await channel.send('I will now be posting deleted message logs in the supplied channel.')
                    .then(msg => {
                        this.client.settings.set(message.guild, 'logs.deleted-messages', channel.id)
                        msg.delete({ 'timeout': 5000})
                })
                    .catch(() => message.util!.send('I do not have permissions to type in this channel.'))
            },
            'edit' : async () => {
                return await channel.send('I will now be posting edited message logs in the supplied channel.')
                    .then(msg => {
                        this.client.settings.set(message.guild, 'logs.edited-messages', channel.id)
                        msg.delete({ 'timeout': 5000 })
                })
                    .catch(() => message.util!.send('I do not have permissions to type in this channel.'))
            },
            'all' : async () => {
                return await channel.send('I will now be posting message logs in the supplied channel.')
                    .then(msg => {
                        this.client.settings.setArr(message.guild, [
                            {'key': 'logs.deleted-messages', 'value': channel.id},
                            {'key': 'logs.edited-messages', 'value': channel.id},
                        ])
                        msg.delete({ 'timeout': 5000 })
                    })
                    .catch(() => message.util!.send('I do not have permissions to type in this channel.'))
            }
        }
        
        await setLogs[type.toLowerCase()].call()
    }
}