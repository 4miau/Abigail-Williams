import { Command, Listener } from 'discord-akairo'
import { Message } from 'discord.js'

export default class CommandBlocked extends Listener {
    public constructor() {
        super('commandblocked', {
            emitter: 'commandHandler',
            event: 'commandBlocked',
            category: 'commandHandler'
        })
    }

    public async exec(message: Message, command: Command, reason: string) {
        const manageReason = {
            'channelBlacklist': async () => {
                return message.util.send('You can not run commands in this channel.')
                    .then(msg => setTimeout(() => msg.delete(), 5000))
            },
            'feedbackBlacklist': async () => {
                return message.util.send('You have been blacklisted from using the feedback command...')
                    .then(msg => setTimeout(() => msg.delete(), 5000))
            },
            'globalBlacklist': async () => {
                return message.util.send('You have been globally blacklisted from using the bot.')
                    .then(msg => setTimeout(() => msg.delete(), 5000))
            },
            'guild': async () => {
                return message.util.send('You can only run this command in a guild!')
                    .then(msg => setTimeout(() => msg.delete(), 5000))
            },
            'musicPremium': async () => {
                return message.util.send('This server is not a premium server so it can not run music commands.')
                    .then(msg => setTimeout(() => msg.delete(), 5000))
            },
            'owner': async () => {
                return message.util.send(`You have been blocked from using ${command} because this is an owner-only command.`)
                    .then(msg => setTimeout(() => msg.delete(), 5000))
            },
            'twitchPremium': async () => {
                return message.util.send('This server is not a premium server so it can\'t run twitch commands.')
                    .then(msg => setTimeout(() => msg.delete(), 5000))
            },
            'userBlacklist': async () => {
                return message.util.send('You have been blacklisted from using bot commands.')
                    .then(msg => setTimeout(() => msg.delete(), 5000))
            },
        }

        console.log(
            `${message.author.username} was blocked from using ${command.id} because of ${reason}!\n` +
            `Guild?: ${message.guild ? `True, ${message.guild.name} (${message.guild.id})` : 'False'}`
        )

        return manageReason[reason].call()
    }
}