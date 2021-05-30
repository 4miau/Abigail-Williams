import { Command, Listener } from 'discord-akairo'
import { Message } from 'discord.js'

export default class CommandBlocked extends Listener {
    public constructor() {
        super('commandblocked', {
            emitter: 'client',
            event: 'commandBlocked',
            category: 'client'
        })
    }

    public async exec(message: Message, command: Command, reason: string) {
        const manageReason = {
            'userBlacklist': async () => { return (await message.util!.send('You have been blacklisted from using bot commands.')).delete({ timeout: 5000 })},
            'globalBlacklist': async () => { return message.util!.send('You have been globally blacklisted from using the bot.')},
            'channelBlacklist': async () => { return (await message.util!.send('You can not run commands in this channel.')).delete({ timeout: 3000 })}
        }

        return await manageReason[reason].call()
    }
}