import { Command } from 'discord-akairo'
import { Role } from 'discord.js'
import { Message } from 'discord.js'

export default class setMuteRole extends Command {
    public constructor() {
        super('muterole', {
            aliases: ['muterole', 'setmuterole', 'setmr'],
            category: 'Configuration',
            description: [
                {
                    content: 'Sets a role as the mute role.',
                    usage: 'muterole [rolename]',
                    example: ['muterole Muted']
                }
            ],
            channel: 'guild',
            userPermissions: ['MANAGE_ROLES'],
            clientPermissions: ['MANAGE_ROLES'],
            ratelimit: 3,
            args: [
                {
                    id: 'create',
                    type: 'string',
                    match: 'option',
                    flag: '-c'
                },
                {
                    id: 'role',
                    type: 'role',
                    prompt: {
                        start: (msg: Message) => `${msg.author}, please target a role (ID or name)`,
                        retry: (msg: Message) => `${msg.author}, please target an existing role (ID or name)`,
                        cancel: () => `The command has now been cancelled.`
                    }
                },
            ]
        })
    }

    public async exec(message: Message, {role}: {role: string}): Promise<Message> {
        const muteRole: Role = message.guild.roles.resolve(role)

        if (muteRole) {
            this.client.settings.set(message.guild, 'mute-role', muteRole.id)
            return message.util!.send('New muterole has been successfully set.')
        }

        return message.util!.send('Can not resolve the muterole.')
    }
}