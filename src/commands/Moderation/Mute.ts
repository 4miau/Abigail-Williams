import { Command } from 'discord-akairo'
import { GuildMemberResolvable, GuildMember, Message, Role } from 'discord.js'
import ms  from 'ms'

export default class Mute extends Command {
    public constructor() {
        super('mute', {
            aliases: ['mute', 'silence', 'shadowrealm'],
            category: 'Moderation',
            description: {
                    content: 'Mute a user from being able to talk.',
                    usage: 'mute [@user} <time> <reason>',
                    examples: ['mute @user bullying']
            },
            channel: 'guild',
            userPermissions: ['MUTE_MEMBERS'],
            clientPermissions: ['MANAGE_ROLES'],
            ratelimit: 3,
            args: [
                {
                    id: 'member',
                    type: 'member',
                    prompt: {
                        start: (msg: Message) => `${msg.author}, please provide a member to mute.`,
                        retry: (msg: Message) => `${msg.author}, please provide a valid member to mute...`,
                        cancel: () => 'The command has been cancelled.'
                    }
                },
                {
                    id: 'time',
                    type: (_: Message, str: string): number => {
                        if (str) {
                            if (Number(ms(str))) return Number(ms(str))
                        }       
                        return 0
                    },
                    match: 'phrase'
                },
                {
                    id: 'reason',
                    type: 'string',
                    match: 'rest',
                    default: 'No reason specified'
                }
            ]
        })
    }

    public async exec(message: Message, { member, time, reason}: {member: GuildMemberResolvable, time: number, reason: string}): Promise<Message> {
        const userResolved: GuildMember = message.guild.members.resolve(member)

        const muteRole: Role = message.guild.roles.resolve(this.client.settings.get(message.guild, 'mute-role', ''))

        if (muteRole) {
            ;(muteRole.editable ? () => {
                userResolved.roles.add(muteRole)
                return message.util!.send(`Muted ${member}`)
            } : () => {
                return message.util!.send('You can not mute this person!')
            })()
        } else {
            return message.util!.send('Please make sure to set a mute role first!')
        }
    }
}