import { Command } from 'discord-akairo'
import { GuildMemberResolvable, GuildMember, Message, Guild, RoleResolvable, Role } from 'discord.js'
import ms  from 'ms'
import { MuteRole } from '../../models/MuteRole'

export default class Mute extends Command {
    public constructor() {
        super('mute', {
            aliases: ['mute', 'silence', 'shadowrealm'],
            category: 'Moderation',
            description: [
                {
                    content: 'Mute a user from being able to talk.',
                    usage: 'mute [@user} <time> <reason>',
                    examples: ['mute @user bullying']
                }
            ],
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

    public async exec(message: Message, { member, time, reason}: {member: GuildMemberResolvable, time: number, reason: string}) {
        const userResolved: GuildMember = message.guild.members.resolve(member)

        const muteRoleID: RoleResolvable = await this.client.db.getRepository(MuteRole).find()
            .then(mrArr => {return mrArr.find(m => m.guild === message.guild.id)})
            .then(mr => mr.role)
            .catch(() => void 0)

        const roleResolved: Role = message.guild.roles.resolve(muteRoleID)

        if (!muteRoleID) {
            return message.util!.send('Failed to get the role id, please make sure you have set a mute role!')
        }

        if (roleResolved.editable || userResolved.id === message.guild.ownerID) {
            try {
                await userResolved.roles.add(roleResolved)
                return message.util!.send(`Muted ${member}`)
            } catch (err) {
                return message.util!.send('You can not mute this person!')
            }
        } else {
            return message.util!.send('Failed to mute for some reason, SERIOUSLY LIKE please check this bro.')
        }
    }
}