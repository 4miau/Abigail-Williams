import { Command } from 'discord-akairo'
import { Message, MessageEmbed } from 'discord.js'

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
                    id: 'commandOrpage',
                    type: 'string',
                }
            ]
        })
    }

    public async exec(message: Message, {commandOrpage}: {commandOrpage: string}): Promise<Message> {
        if (commandOrpage) {
            if (this.client.commandHandler.findCommand(commandOrpage)) {
                const command: Command = this.client.commandHandler.findCommand(commandOrpage)
                return message.util!.send(new MessageEmbed()
                    .setAuthor(`Help | ${command}`, this.client.user.displayAvatarURL())
                    .setColor('#C3B1E1')
                    .setDescription(`
                        **Aliases:**
                        ${command.aliases.join(', ') || 'No alises for this command.'}
    
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
        }

        this.run(message, commandOrpage ? parseInt(commandOrpage) : 1)
    }

    private async run(message: Message, page: null | number): Promise<Message> {
        const pages = [
            [ 'General', 'Images', 'Action', 'Anime', 'Fun', 'Utility' ],
            [ 'Twitch', 'Modmail', 'Moderation', 'Configuration' ],
            [ 'Owner' ]
        ]

        let cmds: Command[] = []

        for (const category of this.handler.categories.values()) {
            for (const cmd of category) {
                cmds.push(cmd[1])
            }
        }

        const obj = {}

        for (const cmd of cmds.sort((a,b) => a.aliases[0].localeCompare(b.aliases[0]))) {
            obj[cmd.category.id] = [...(obj[cmd.category.id] || []), cmd.aliases[0]]
        }

        for (const category of Object.keys(obj)) {
            obj[category] = Object.values(obj[category]).sort(
                (a: string, b: string) => a.localeCompare(b)
            )
        }

        page = page || 1

        let selectedPage: number = page

        if (selectedPage > pages.length || selectedPage <= 0) selectedPage = 1
        if (selectedPage === pages.length && message.author.id !== this.client.ownerID) selectedPage = 1

        return message.util!.send(new MessageEmbed()
            .setDescription(pages[selectedPage - 1]
                .sort(
                    (a, b) => a.localeCompare(b)
                )
                .map(
                    (category) => `**${category}**\n\`${Object.values(obj[category]).join("`, `")}\``
                ).join('\n\n')
            )
            .setColor('#C3B1E1')
            .setFooter(`Page (${selectedPage}/${pages.length})`)
        )
    }
}

//Sorry for the horrible code in advance.