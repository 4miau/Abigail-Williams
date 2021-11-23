import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

export default class MaxMentions extends Command {
    public constructor() {
        super('maxmentions', {
            aliases: ['maxmentions'],
            category: 'Automation',
            description: {
                content: 'Sets the max amount of mentions allowed in a message. Warns users who add more than this threshold.',
                usage: 'maxmentions <threshold>',
                examples: ['maxmentions', 'maxmentions 5'],
            },
            channel: 'guild',
            ratelimit: 3,
            args: [
                {
                    id: 'threshold',
                    type: (_: Message, str: string): number => {
                        if (str) if (Number(str)) return Number(str)
                        return null
                    }
                }
            ]
        })
    }

    //@ts-ignore
    userPermissions(message: Message) {
        const modRole = this.client.settings.get(message.guild, 'modRole', '')
        const hasStaffRole = message.member.permissions.has('MANAGE_GUILD', true) || message.member.roles.cache.has(modRole)

        if (!hasStaffRole) return 'Moderator'
        return null
    }

    public exec(message: Message, {threshold}: {threshold: number}): Promise<Message> {
        const currThreshold = this.client.settings.get(message.guild.id, 'auto-mod.maxMentions', 0)

        if (threshold === null || threshold === undefined) return message.util.send(currThreshold === 0 ? 'There is no threshold set for this server.' : `The max mentions threshold is ${currThreshold}`)
        if (threshold > 10 || threshold < 0) return message.util.send('Don\'t you think that\'s a bit inappropriate for an amount?')

        if (threshold === 0) {
            this.client.settings.set(message.guild.id, 'auto-mod.maxMentions', threshold)
            return message.util.send('New max mentions threshold has been set successfully.')
        }
        else {
            this.client.settings.delete(message.guild.id, 'auto-mod.maxMentions')
            return message.util.send('Max mentions automoderation for this server has been removed.')
        }
    }
}