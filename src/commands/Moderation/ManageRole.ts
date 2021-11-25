import { Command } from 'discord-akairo'
import { ColorResolvable, Message, Role } from 'discord.js'

export default class ManageRole extends Command {
    public constructor() {
        super('managerole', {
            aliases: ['managerole'],
            category: 'Moderation',
            description: {
                content: 'Allows you to manage an existing role. (colours need to be hex without the hashtag)',
                usage: 'managerole [role] <-name [newname]> | <-colour [newColour]> | <-hoist [true/false]> | <-mentionable [true/false]>',
                examples: ['managerole members -name verified | -colour aaeeaa | -hoist true | -mentionable false'],
                flags: ['-name', '-colour', '-hoist', '-mentionable']
            },
            ratelimit: 3,
            args: [
                {
                    id: 'role',
                    type: 'role',
                },
                {
                    id: 'name',
                    type: 'string',
                    match: 'option',
                    flag: '-name'
                },
                {
                    id: 'colour',
                    type: 'string',
                    match: 'option',
                    flag: ['-color', '-colour'],
                },
                {
                    id: 'mentionable',
                    type: 'boolean',
                    match: 'option',
                    flag: '-mentionable'
                },
                {
                    id: 'hoist',
                    type: 'boolean',
                    match: 'option',
                    flag: '-hoist'
                }

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

    public exec(message: Message, {role, name, colour, mentionable, hoist}: {role: Role, name: string, colour: string, mentionable: boolean, hoist: boolean}): Promise<Message> {
        if (!role) return message.channel.send('You at least need a role to edit. Provide a role to edit.')
        const hexRegex: RegExp = /[0-9A-Fa-f]{6}/g

        try {
            role.edit({
                'name': name ? name : void 0,
                'color': (colour && hexRegex.test(colour)) ? colour as ColorResolvable : void 0,
                'hoist': hoist ? hoist : void 0,
                'mentionable': mentionable ? mentionable : void 0,
            })
            return message.channel.send('I have edited the permissions for this role.')
        } catch (err) {
            return message.channel.send('Please ensure I have manage role perms and have a role above the one you are trying to edit.')
        }
    }
}