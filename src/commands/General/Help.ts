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
                    id: 'type',
                    type: 'string',
                }
            ]
        })
    }

    public async exec(message: Message, {type}: {type: string}): Promise<Message> {
        if (type) {
            if (!this.client.commandHandler.findCommand(type)) return this.run(message, type ? parseInt(type) : 1)

            if ((this.client.commandHandler.findCommand(type).categoryID === 'Owner' || this.client.commandHandler.findCommand(type).categoryID === 'Developer') && !this.client.isOwner(message.author.id)) {
                return message.channel.send('Only the owner can run help on owner commands of course.')
            }

            const command: Command = this.client.commandHandler.findCommand(type)
            if (!command) return message.channel.send('Unable to find the command, please try again.')
            
            const e = new MessageEmbed()
                .setAuthor(`Help | ${command}`, this.client.user.displayAvatarURL())
                .setColor('#C3B1E1')
                .setDescription(
                    `**Aliases:**\n${command.aliases.map(a => `\`${a}\``).join(', ') || 'No alises for this command.'}` +

                    `\n\n**Description:**\n${command.description.content || 'No content provided'}` +

                    `\n\n**Usage:**\n${command.description.usage || 'No usage provided'}` +

                    `\n\n**Examples:**\n${command.description.examples ? command.description.examples.map((e: any) => `\`${e}\``).join('\n') : 'No examples provided.' }` +
                    
                    `${command.description.flags ? `\n\n**Flags:**\n${command.description.flags.join(', ')}` : ''}` +
                    
                    `${command.description.tags ? `\n\n**Tags:**\n${command.description.tags.join('\n')}` : ''}`
                )
                .setFooter('Syntax: [] = required, <> = optional, {} = optional tag')

            return message.channel.send({ embeds: [e] })
        }

        this.run(message, type ? parseInt(type) : 1)
    }

    private async run(message: Message, page: null | number): Promise<Message> {
        const pages = [
            [ 'General', 'Images', 'Action', 'Anime', 'Fun', 'Games' ],
            [ 'Music' ],
            [ 'Utility', 'Twitch', 'Starboard' ],
            [ 'Reaction Roles' ],
            [ 'Modmail', 'Moderation', 'Logging', 'Configuration', 'Automation' ],
            [ 'Owner', 'Developer' ]
        ]

        let cmds: Command[] = []

        for (const category of this.handler.categories.values()) {
            for (const cmd of category) cmds.push(cmd[1])
        }

        const obj = {}

        for (const cmd of [...cmds].sort((a,b) => a.id.localeCompare(b.id))) {
            obj[cmd.category.id] = [...(obj[cmd.category.id] || []), cmd.id]
        }

        for (const category of Object.keys(obj)) {
            obj[category] = Object.values(obj[category]).sort((a: any, b: any) => a.localeCompare(b))
        }

        page = page || 1

        let selectedPage: number = page

        if (selectedPage > pages.length || selectedPage <= 0) selectedPage = 1
        if (selectedPage === pages.length && message.author.id !== this.client.ownerID) selectedPage = 1

        const e = new MessageEmbed()
            .setDescription([...pages[selectedPage - 1]]
                .sort((a, b) => a.localeCompare(b))
                .map((category) => `**${category}**\n\`${Object.values(obj[category]).join('`, `')}\``)
                .join('\n\n')
            )
            .setColor('#C3B1E1')
            .setFooter(`Page (${selectedPage}/${pages.length})`)

        return message.channel.send({ embeds: [e] })
            .then(msg => {
                setTimeout(() => { msg.delete() }, 6e5)
                return msg
            })
    }
}

/*
            [ 'General', 'Images', 'Action', 'Anime', 'Fun', 'Games' ],
            [ 'Levelling', 'Economy', 'Music' ],
            [ 'Utility', 'Twitch', 'Twitter', 'Starboard' ],
            [ 'Modmail', 'Moderation', 'Logging', 'Configuration', 'Automation' ],
            [ 'Owner', 'Developer' ]
*/