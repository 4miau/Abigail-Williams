import { Command } from 'discord-akairo'
import { Message, User } from 'discord.js'

export default class FeedbackBlacklist extends Command {
    public constructor() {
        super('feedbackblacklist', {
            aliases: ['feedbackblacklist', 'blacklistfb', 'fbblacklist'],
            category: 'Developer',
            description: {
                content: 'Adds or removes a user from being able to post feedback for the bot.',
                usage: 'feedbackblacklist [\'add\'/\'remove\'] [user]',
                examples: ['feedbackblacklist add @user'],
            },
            ownerOnly: true,
            channel: 'guild',
            ratelimit: 3,
        })
    }

    *args() {
        const type = yield {
            index: 0,
            type: (_: Message, str: string) => {
                if (str) {
                    if (str.toLowerCase() === 'add' || str.toLowerCase() === 'remove') return str
                    return null
                }
            },
            match: 'phrase',
            default: null
        }

        const user = yield {
            index: 1,
            type: 'user',
            match: 'rest'
        }

        return { type, user }
    }

    public exec(message: Message, {type, user}: {type: string, user: User}): Promise<Message> {
        if (!type) return message.util.send('I will not be able to tell whether to add or remove a user from the feedback blacklist.')
        if (!user) return message.util.send('You should provide a member to determine whether to add/remove them.')

        if (type === 'add') {
            const fbBlacklist: string[] = this.client.settings.get('global', 'feedback-blacklist', [])

            if (fbBlacklist.includes(user.id)) return message.util.send('This user is already blacklisted from posting feedback.')

            fbBlacklist.push(user.id)
            this.client.settings.set('global', 'feedback-blacklist', fbBlacklist)
            return message.util.send(`${user.tag} has been blacklisted from posting feedback.`)
        }
        else {
            const fbBlacklist: string[] = this.client.settings.get('global', 'feedback-blacklist', [])

            if (!fbBlacklist.includes(user.id)) return message.util.send('This user is not blacklisted so I do not need to remove them.')

            this.client.settings.set('global', 'feedback-blacklist', fbBlacklist.filter(u => u !== user.id))
            return message.util.send(`${user.tag} can post feedback again.`)
        }
    }
}