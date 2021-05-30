import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

export default class ChangeLogEdit extends Command {
    public constructor() {
        super('changelogedit', {
            aliases: ['changelogedit', 'edittochangelog', 'editchangelog'],
            category: 'Owner',
            description: {
                content: 'Edits an existing entry on the changelog.',
                usage: 'editchangelog [key] [content]',
                examples: ['editchangelog 3 New command working'],
            },
            ownerOnly: true,
            ratelimit: 3,
            args: [
                {
                    id: 'key',
                    type: 'number'
                },
                {
                    id: 'content',
                    type: 'string',
                    match: 'rest'
                }
            ]
        })
    }

    public exec(message: Message, {key, content}: {key: number, content: string}): Promise<Message> {
        if (!key) return message.util!.send('Okay so how on earth am I supposed to know which entry to edit?')

        const changeLog: { key: number, type: string, content: string }[] = this.client.settings.get('global', 'changeLog', [])

        if (changeLog.length === 0) return message.util!.send('There are no entries so I can not edit any entries.')
        if (changeLog.length < key) return message.util!.send('I can not edit that entry because it is non-existent, choose a valid number.')

        changeLog.find(e => e.key === key).content = content
        this.client.settings.set('global', 'changeLog', changeLog)

        return message.util!.send('Changelog entry has successfully been edited.')
    }
}