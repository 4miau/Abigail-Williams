import { Command } from 'discord-akairo'
import { Message, MessageEmbed } from 'discord.js'
import { Colours } from '../../util/Colours'
import { changeLog } from '../../util/Constants'

export default class Changelog extends Command {
    public constructor() {
        super('changelog', {
            aliases: ['changelog'],
            category: 'General',
            description: {
                content: 'Displays my recent updates and changelog.',
                usage: 'changelog',
                examples: ['changelog'],
            },
            ratelimit: 3
        })
    }

    public exec(message: Message): Promise<Message> {
        const embed = new MessageEmbed()
            .setAuthor('Bot Changelog', this.client.user.displayAvatarURL())
            .setDescription(`${changeLog.join('\n')}`)
            .setThumbnail(this.client.users.cache.get(this.client.ownerID as string).displayAvatarURL())
            .setColor(Colours.Pinky)
            .setFooter('Key: ADD: Add, UPD: Update, REM: Remove, FIX: Fix, CHO: Chore')

        return message.util!.send(embed)
    }
}