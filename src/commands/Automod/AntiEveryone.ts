import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

export default class AntiEveryone extends Command {
    public constructor() {
        super('antieveryone', {
            aliases: ['antieveryone'],
            category: 'Automod',
            description: {
                content: 'Warns users for trying to do an everyone ping.',
                usage: 'antieveryone <enable/disable>',
                examples: ['antieveryone enable'],
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
        const automodState: boolean = this.client.settings.get(message.guild, 'auto-mod.antiEveryone', false)

        if (!state) return message.util!.send(`Anti-everyone is currently enabled in this server? ${automodState}`)
        
        state.toLowerCase() === 'enable' ? 
            this.client.settings.set(message.guild, 'auto-mod.antiEveryone', true) : this.client.settings.set(message.guild, 'auto-mod.antiEveryone', false)

        return message.util!.send(`Anti-everyone is now ${state.toLowerCase() +'d'} in this server.`)
    }
}