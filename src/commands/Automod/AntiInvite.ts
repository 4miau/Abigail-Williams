import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

export default class AntiInvite extends Command {
    public constructor() {
        super('antiinvite', {
            aliases: ['antiinvite'],
            category: 'Automod',
            description: {
                content: 'Warns users for trying to post invites',
                usage: 'antiinvite <enable/disable>',
                examples: ['antiinvite enable'],
            },
            channel: 'guild',
            ratelimit: 3,
            args: [
                {
                    id: 'state',
                    type: (_: Message, str: string): string => {
                        if (str) if (str === 'enable' || str === 'disable') return str
                        return null
                    }
                }
            ]
        })
    }

    //@ts-ignore
    userPermissions(message: Message) {
        const modRole: string = this.client.settings.get(message.guild, 'modRole', '')
        const hasStaffRole = message.member.hasPermission('MANAGE_GUILD', { checkAdmin: true, checkOwner: true}) || message.member.roles.cache.has(modRole)

        if (!hasStaffRole) return 'Moderator'
        return null
    }

    public exec(message: Message, {state}: {state: string}): Promise<Message> {
        const automodState: boolean = this.client.settings.get(message.guild, 'auto-mod.antiInvite', false)

        if (!state) return message.util!.send(`Anti-Invite is enabled in this server: ${automodState}`)

        state.toLowerCase() === 'enable' ?
            this.client.settings.set(message.guild, 'auto-mod.antiInvite', true) : this.client.settings.set(message.guild, 'auto-mod.antiInvite', false)

        return message.util!.send(`Anti-invite is now ${state.toLowerCase() + 'd'} in this server.`)
    }
}