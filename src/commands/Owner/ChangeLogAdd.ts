import { Argument, Command } from 'discord-akairo'
import { Message } from 'discord.js'

export default class ChangeLogAdd extends Command {
    public constructor() {
        super('changelogadd', {
            aliases: ['changelogadd', 'addtochangelog', 'addchangelog'],
            category: 'Owner',
            description: {
                content: 'Adds an entry to the changelog.',
                usage: 'changelogadd [type] [content]',
                examples: ['changelogadd add test'],
                tags: [
                    'ADD - Add, new content/a feature was added.', 
                    'DEL - Delete, some content/a feature has been removed.', 
                    'UPD - Update, a feature has been updated.', 
                    'FIX - Fix, some content/feature has been fixed.', 
                    'CHO - Chore, code for a feature has been cleaned/optimized.'
                ]
            },
            ownerOnly: true,
            ratelimit: 3,
            args: [
                {
                    id: 'type',
                    type: Argument.union('changelog'),
                    match: 'phrase'
                },
                {
                    id: 'content',
                    type: 'string',
                    match: 'rest'
                }
            ]
        })
    }

    public exec(message: Message, {type, content}: {type: string, content: string}): Promise<Message> {
        if (!type) return message.util!.send('You need to provide a valid type to add something to the changelog.')

        const changeLog: { key: number, type: string, content: string }[] = this.client.settings.get('global', 'changeLog', [])
        const key = changeLog.length === 0 ? 1 : (changeLog.length + 1)

        changeLog.push({ key: key, type: type, content: content })
        this.client.settings.set('global', 'changeLog', changeLog)

        return message.util!.send('Changelog successfully added.')
    }
}