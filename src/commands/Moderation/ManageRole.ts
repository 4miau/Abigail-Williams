import { Command } from 'discord-akairo'
import { Message, Role } from 'discord.js'

export default class ManageRole extends Command {
    public constructor() {
        super('managerole', {
            aliases: ['managerole'],
            category: 'Moderation',
            description: {
                content: 'Allows you to manage an existing role. (colours need to be hex without the hashtag)',
                usage: 'managerole [role] <-name [newname]> | <-colour [newColour]> | <-hoist [true/false]> | <-mentionable [true/false]>',
                examples: ['managerole members -name verified | -colour aaeeaa | -hoist true | -mentionable false'],
            },
            userPermissions: ['MANAGE_ROLES'],
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

    public exec(message: Message, {role, name, colour, mentionable, hoist}: {role: Role, name: string, colour: string, mentionable: boolean, hoist: boolean}): Promise<Message> {
        if (!role) return message.util!.send('You at least need a role to edit. Provide a role to edit.')
        const hexRegex: RegExp = /[0-9A-Fa-f]{6}/g

        try {
            role.edit({
                'name': name ? name : void 0,
                'color': (colour && hexRegex.test(colour)) ? colour : void 0,
                'hoist': hoist ? hoist : void 0,
                'mentionable': mentionable ? mentionable : void 0,
            })
            return message.util!.send('I have edited the permissions for this role.')
        } catch (err) {
            return message.util!.send('Please ensure I have manage role perms and have a role above the one you are trying to edit.')
        }
    }
}

//TODO: Try using Generator Args instead of standard args to clean up the args, learn gen args