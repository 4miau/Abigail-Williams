import { Command } from 'discord-akairo'
import { Message, MessageEmbed } from 'discord.js'

import { commandsGithub, minPages, maxPages, pages } from '../../utils/Constants'

export default class Help extends Command {
    public constructor() {
        super('help', {
            aliases: ['help'],
            category: 'General',
            description: [
                {
                    content: 'Lists all the commands',
                    usage: 'help <command>',
                    examples: ['help', 'help ping']
                }
            ],
            clientPermissions: ['EMBED_LINKS'],
            ratelimit: 3,
            args: [
                {
                    id: 'command',
                    type: 'string'
                },
                {
                    id: 'page',
                    type: (_: Message, str: string): null | number => {
                        if (parseInt(str)) return Number(str)
                        return null
                    }
                }
            ]
        })
    }

    private validatePage(page: number, uid: string): number | null {
        if (page === 3 && uid === this.client.ownerID) return page
        if (pages.includes(page) && uid) return page
        return 1
    }

    public exec(message: Message, {command, page}: {command: string, page: number}): Promise<Message> {
        //Validation before retrieving the help messages
        if (!isNaN(parseInt(command)) && !page) {
            page = parseInt(command)
            command = null

            if (page) page = this.validatePage(page, message.author.id)
        } else if (command && page) {
            page = null
        } else page = 1 

        //Help embeds
        if (!command && page === 1) {
            return message.util!.send(new MessageEmbed()
                .setAuthor('Standard Commands', 'https://i.imgur.com/1T4RT2w.png', commandsGithub)
                .setDescription(`Type ${this.client.commandHandler.prefix}help [command] for more help on a command`)
                .addField('General', '`help`', true)
                .addField('Fun', '`rr`,`8ball`,`gayrate`', true)
                .addField('Utility', '`ping`,`avatar`,`uptime`', true)
                .addField('\u200B', '\u200B')
                .setFooter(`Type ${this.client.commandHandler.prefix}help 2 for mod & config commands.`)
            )
        } else if (!command && page === 2) {
            return message.util!.send(new MessageEmbed()
                .setAuthor('Moderator Commands', 'https://i.imgur.com/1T4RT2w.png', commandsGithub)
                .setDescription(`Type ${this.client.commandHandler.prefix}help [command] for more help on a command`)
                .addField('Moderation', '`ban`,`unban`,`kick`,`warn`,\n`fixname`,`slowmode`,`prune (WIP)`', true)
                .addField('Configuration', '`setmuterole`', true)
            )
        } else if (!command && page === 3 && message.author.id === this.client.ownerID) {
            return message.util!.send(new MessageEmbed()
                .setAuthor('Owner Commands', 'https://i.imgur.com/1T4RT2w.png', commandsGithub)
                .setDescription(`Hiya there Miau! You're pog!`)
                .addField('Owner', '`activity`,`build`,`eval`,`restart`,\n`shutdown`,`status`', true)
            )
        }
    }
}