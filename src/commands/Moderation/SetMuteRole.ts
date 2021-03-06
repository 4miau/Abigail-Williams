import { Argument, Command } from 'discord-akairo'
import { Permissions, Role, Message } from 'discord.js'

export default class setMuteRole extends Command {
    public constructor() {
        super('muterole', {
            aliases: ['muterole', 'setmuterole', 'setmr'],
            category: 'Moderation',
            description: {
                    content: 'Sets a role as the mute role. (creates a mute role if you provide the create flag)',
                    usage: 'muterole [rolename]',
                    example: ['muterole Muted'],
                    flags: ['-c']
            },
            channel: 'guild',
            ratelimit: 3,
            args: [
                {
                    id: 'role',
                    type: Argument.union('role', 'string'),
                    prompt: {
                        start: (msg: Message) => `${msg.author}, please target a role (ID or name)`,
                        retry: (msg: Message) => `${msg.author}, please target an existing role (ID or name)`,
                        cancel: () => 'The command has now been cancelled.'
                    }
                },
                {
                    id: 'create',
                    match: 'option',
                    flag: '-c'
                },
            ]
        })
    }

    //@ts-ignore
    userPermissions(message: Message) {
        const modRole = this.client.settings.get(message.guild, 'modRole', '')
        const hasStaffRole = message.member.permissions.has('MANAGE_ROLES', true) || message.member.roles.cache.has(modRole)

        if (!hasStaffRole) return 'Moderator'
        return null
    }

    public async exec(message: Message, {role, create}): Promise<Message> {
        if (!role || (typeof role === 'string' && !create)) return message.channel.send('Can not resolve the muterole, please try again.')

        if (typeof role === 'object') {
            this.client.settings.set(message.guild, 'muteRole', role.id)
            return message.channel.send('New muterole has been successfully set.')
        }

        if (typeof role === 'string' && create) {
            const newRole = await message.guild.roles.create({ name: role })
            this.client.settings.set(message.guild, 'muteRole', newRole.id)
            return (await this.setRoleProperties(newRole)) === true ? 
            message.channel.send('New muterole has been successfully created.') : 
            message.channel.send('Error creating and setting the new muterole, please try again.')
        }
    }

    private async setRoleProperties(role: Role): Promise<boolean> {
        try {
            const mutePerms = new Permissions([ 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY' ]).remove('SEND_MESSAGES')

            await role.setMentionable(false)
            await role.setHoist(false)
            await role.setColor('#818386')
            await role.setPermissions(mutePerms)

            return true
        } catch {
            return false
        }
    }
}