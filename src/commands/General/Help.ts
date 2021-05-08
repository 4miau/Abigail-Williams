import { Command } from 'discord-akairo'
import { Message, MessageEmbed } from 'discord.js'
import { stripIndents } from 'common-tags'

import { Colours } from '../../utils/Colours'

export default class Help extends Command {
    public constructor() {
        super('help', {
            aliases: ['help', 'h', 'commands', 'cmds'],
            category: 'General',
            description: {
                    content: 'Lists all the commands, or specific information on one command.',
                    usage: 'help <command> <-dm>',
                    examples: ['help', 'help ping']
            },
            clientPermissions: ['EMBED_LINKS'],
            ratelimit: 3,
            args: [
                {
                    id: 'command',
                    type: 'commandAlias',
                    default: null
                },
                {
                    id: 'page',
                    type: (_: Message, str: string): null | number => {
                        if (parseInt(str)) return Number(str)
                        return null
                    }
                },
                {
                    id: 'dms',
                    type: 'string',
                    match: 'option',
                    flag: '-dm'
                }
            ]
        })
    }

    public async exec(message: Message, {command, dms}: {command: Command, dms: string}): Promise<Message> {
        if (command) {
            return message.util!.send(new MessageEmbed()
                .setAuthor(`Help | ${command}`, this.client.user.displayAvatarURL())
                .setColor(Colours.Mint)
                .setDescription(stripIndents`
                    **Description:**
                    ${command.description.content || 'No content provided'}

                    **Usage:**
                    ${command.description.usage || 'No usage provided'}

                    **Examples:**
                    ${command.description.examples ? command.description.examples.map((e: any) => `\`${e}\``).join('\n') : 'No examples provided.'}
                `)
                .setFooter('Syntax: [] = required, <> = optional')
            )
        }

        const embed = new MessageEmbed()
            .setAuthor(`Help | ${this.client.user.username}`, this.client.user.displayAvatarURL())
            .setColor(Colours.Mint)
            .setFooter(`${this.client.settings.get(message.guild, 'config.prefix', '')}help command for more information on a command`)

        for (const category of this.handler.categories.values()) {
            if (["default"].includes(category.id)) continue

            embed.addField(category.id, category
                .filter(cmd => cmd.aliases.length > 0)
                .map(cmd => `**\`${cmd}\`**`)
                .join(', ') || 'No commands in this category.'
            )
        }

        if (dms) return await message.member.send(embed)

        return message.channel.send(embed)
    }
}


/*
import { Client, Message, MessageEmbed } from "discord.js";
import CommandStore from "../../stores/CommandStore";
export async function run (msg: Message, args: string[]) {
    const cmds = Array.from(CommandStore.values())

    const obj = {}

    for (const cmd of cmds.sort((a,b)=>a.config.name.localeCompare(b.config.name))) {
        if (!obj[cmd.config.category]) obj[cmd.config.category] = []
        obj[cmd.config.category].push(cmd.config.name)
    }

    msg.channel.send(
        new MessageEmbed().setColor("#C3B1E1").setDescription(Object.keys(obj).sort((a,b)=>a.localeCompare(b)).map(key=>`**${key}**\n\`${obj[key].join('`, `')}\``).join('\n\n'))
    )
}

export const config = {
    aliases: ['h']
}
*/

/*
    private validatePage(page: number, uid: string): number | null {
        if (page === 3 && uid === this.client.ownerID) return page
        if (pages.includes(page) && uid) return page
        return 1
    }

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
                .setDescription(`Type ${this.client.settings.get(message.guild, 'config.prefix', 'a.')}help [command] for more help on a command`)
                .addField('General', '`help`', true)
                .addField('Fun', '`rr`,`8ball`,`gayrate`', true)
                .addField('Utility', '`ping`,`avatar`,`uptime`', true)
                .addField('\u200B', '\u200B')
                .setFooter(`Type ${this.client.settings.get(message.guild, 'config.prefix', 'a.')}help 2 for mod & config commands.`)
            )
        } else if (!command && page === 2) {
            return message.util!.send(new MessageEmbed()
                .setAuthor('Moderator Commands', 'https://i.imgur.com/1T4RT2w.png', commandsGithub)
                .setDescription(`Type ${this.client.settings.get(message.guild, 'config.prefix', 'a.')}help [command] for more help on a command`)
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
*/