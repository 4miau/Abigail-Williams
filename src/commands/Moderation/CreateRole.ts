import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

export default class CreateRole extends Command {
    public constructor() {
        super('createrole', {
            aliases: ['createrole', 'newrole'],
            category: 'Moderation',
            description: {
                content: 'Creates a new role (colours need to be hex without the hashtag)',
                usage: 'createrole [rolename] <colour> <mentionable(true/false)> <hoist(true/false)>',
                examples: ['createrole members eeaaee false true'],
            },
            userPermissions: ['MANAGE_ROLES'],
            ratelimit: 3,
            args: [
                {
                    id: 'rolename',
                    type: 'string',
                    match: 'phrase'
                },
                {
                    id: 'colour',
                    type: 'string',
                    match: 'phrase'
                },
                {
                    id: 'mentionable',
                    type: 'boolean',
                },
                {
                    id: 'hoist',
                    type: 'boolean',
                }
            ]
        })
    }

    public async exec(message: Message, {rolename, colour, mentionable, hoist}: {rolename: string, colour: string, mentionable: boolean, hoist: boolean}): Promise<Message> {
        if (!rolename) return message.util!.send('You must provide a rolename at least for the new role.')
        const hexRegex: RegExp = /[0-9A-Fa-f]{6}/g

        try {
            await message.guild.roles.create({
                'data': {
                    'name': rolename,
                    'color': (colour && hexRegex.test(colour)) ? colour : void 0,
                    'mentionable': mentionable ? mentionable : false,
                    'hoist': hoist ? hoist : false
                }
            })
            return message.util!.send('Created the new role successfully.')
        } catch (err) {
            return message.util!.send('I\'m unable to create the new role, please check my permissions.')
        }
    }
}