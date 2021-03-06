import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

export default class ChangeLogRemove extends Command {
    public constructor() {
        super('changelogremove', {
            aliases: ['changelogremove', 'removefromchangelog', 'removechangelog'],
            category: 'Developer',
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
        if (!key) return message.util.send('Okay, so how do I know which entry to remove then? Nice one.')

        const changeLog: { key: number, type: string, content: string }[] = this.client.settings.get('global', 'changeLog', [])

        if (changeLog.length === 0) return message.util.send('There are no entries, so there is nothing to even remove.')
        if (changeLog.length < key) return message.util.send('That is not a valid entry, please try again.')

        this.client.settings.set('global', 'changeLog', this.fixChangeLog(changeLog.filter(e => e.key !== key)))
        return message.util.send('Changelog entry has successfully been removed.')
    }

    private fixChangeLog(obj: { key: number, type: string, content: string }[]) {
        const maxVal = Math.max.apply(null, obj.map(o => o.key))
        let temp = 0

        for (let i = 0; i < maxVal; i++) {
            console.log(obj[i])
            if (!obj[i] || obj[i].key !== (i + 1)) temp = i + 1

            if (obj[i] && temp) {
                obj[i].key = temp
                temp = null
            }
        }
        
        return obj
    }
}