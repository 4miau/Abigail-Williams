import { Command } from 'discord-akairo'
import { Message } from 'discord.js'
import { execSync } from 'child_process'

export default class Exec extends Command {
    public constructor() {
        super('exec', {
            aliases: ['exec'],
            category: 'Owner',
            description: {
                content: 'Execute shell/terminal commands.',
                usage: 'exec [terminal commands]',
                examples: ['exec help'],
            },
            ownerOnly: true,
            ratelimit: 3,
            args: [
                {
                    id: 'commands',
                    type: 'string',
                    match: 'rest'
                }
            ]
        })
    }

    private cutString(str: string, max = 30) {
        if (str.length > max) return `${str.substr(0, max)}...`;
        return str;
    }

    public exec(message: Message, {commands}: {commands: string}): Promise<any> {
        if (!commands) return message.util!.send('There is nothing for me to exactly run here...')

        try {
            let executed = execSync(commands).toString()
            if (executed) return message.react('✅')

            if (executed.length > 2000) {
                return message.util.send(`\`\`\`prolog\n$ ${message.util.parsed.content}\n\n${this.cutString(executed, 1970 - message.util.parsed.content.length)}\`\`\``);
            }
            return message.util.send(`\`\`\`prolog\n$ ${message.util.parsed.content}\n\n${executed}\`\`\``);
        } catch (e) {
            this.client.logger.log('ERROR', `There was an error running the exec code. Message: ${e.message}`)
            return message.util!.send(`\`\`\`prolog\n${message.util!.parsed.content}\n\n${e.message}\`\`\``)
        }
    }
}