import { Command } from 'discord-akairo'
import { GuildMemberResolvable, GuildMember, Message, Guild, RoleResolvable } from 'discord.js'
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
            clientPermissions: ['MUTE_MEMBERS'],
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
                    type: (_: Message, str: string) => {
                        if (Number(ms(str))) return Number(ms(str))
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
        console.log('I reached here.')
        let userResolved: GuildMember = message.guild.members.resolve(member)

        console.log(userResolved)

        let muteRoleID: string = await this.client.db.getRepository(MuteRole).find()
            .then(mrArr => {return mrArr.find(m => m.guild === message.guild.id)})
            .then(mr => muteRoleID = mr.guild)
        
        console.log(muteRoleID)

        if (!muteRoleID) {
            return message.util!.send('Failed to get the role id, please make sure you have set a mute role!')
        }

        if (userResolved.roles.highest.position < message.member.roles.highest.position || userResolved.user.id === message.guild.ownerID) {
            return message.util!.send('You can not mute this person!')
        } else {
            try {
                userResolved.roles.add(muteRoleID)
                return message.util!.send(`Muted ${member}.`)
            } catch (err) {
                return message.util!.send('Failed to mute for some reason, please check this bro.')
            }
        }
    }
}