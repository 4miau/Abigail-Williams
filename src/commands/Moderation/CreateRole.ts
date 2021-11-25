import { Command } from 'discord-akairo'
import { ColorResolvable, Message } from 'discord.js'

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

    //@ts-ignore
    userPermissions(message: Message) {
        const modRole = this.client.settings.get(message.guild, 'modRole', '')
        const hasStaffRole = message.member.permissions.has('MANAGE_ROLES', true) || message.member.roles.cache.has(modRole)

        if (!hasStaffRole) return 'Moderator'
        return null
    }

    public async exec(message: Message, {rolename, colour, mentionable, hoist}: {rolename: string, colour: string, mentionable: boolean, hoist: boolean}): Promise<Message> {
        if (!rolename) return message.channel.send('You must provide a rolename at least for the new role.')
        const hexRegex: RegExp = /[0-9A-Fa-f]{6}/g

        try {
            await message.guild.roles.create({
                'name': rolename,
                'color': (colour && hexRegex.test(colour)) ? colour as ColorResolvable : void 0,
                'mentionable': mentionable ? mentionable : false,
                'hoist': hoist ? hoist : false
            })
            return message.channel.send('Created the new role successfully.')
        } catch (err) {
            return message.channel.send('I\'m unable to create the new role, please check my permissions.')
        }
    }
}