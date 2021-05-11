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
                .setDescription(`
                    **Description:**
                    ${command.description.content || 'No content provided'}

                    **Usage:**
                    ${command.description.usage || 'No usage provided'}

                    **Examples:**
                    ${command.description.examples ? command.description.examples.map((e: any) => `\`${e}\``).join('\n') : 'No examples provided.'}
                    \
                    ${command.description.flags ?
                    `**Flags:**       
                    ${command.description.flags.join(', ')}
                    `: ''}
                    \
                    ${command.description.tags ? `**Tags:**
                    ${command.description.tags.join('\n')}
                    `:''}
                    
                `)
                .setFooter('Syntax: [] = required, <> = optional, {} = optional tag')
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