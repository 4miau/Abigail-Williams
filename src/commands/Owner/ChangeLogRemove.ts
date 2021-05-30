import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

export default class ChangeLogRemove extends Command {
    public constructor() {
        super('changelogremove', {
            aliases: ['changelogremove', 'removefromchangelog', 'removechangelog'],
            category: 'Owner',
            description: {
                content: 'Removes an entry from the changelog.',
                usage: 'changelogremove [key]',
                examples: ['changelogremove 1'],
            },
            ownerOnly: true,
            ratelimit: 3,
            args: [
                {
                    id: 'key',
                    type: 'number'
                }
            ]
        })
    }

    public exec(message: Message, {key}: {key: number}): Promise<Message> {
        if (!key) return message.util!.send('Okay, so how do I know which entry to remove then? Nice one.')

        const changeLog: { key: number, type: string, content: string }[] = this.client.settings.get('global', 'changeLog', [])

        if (changeLog.length === 0) return message.util!.send('There are no entries, so there is nothing to even remove.')
        if (changeLog.length < key) return message.util!.send('That is not a valid entry, please try again.')

        this.client.settings.set('global', 'changeLog', changeLog.filter(e => e.key !== key))
        return message.util!.send('Changelog entry has successfully been removed.')
    }
}