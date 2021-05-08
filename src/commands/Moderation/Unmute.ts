import { Command } from 'discord-akairo'
import { GuildMemberResolvable, Message, RoleResolvable, GuildMember } from 'discord.js'

import { MuteRole } from '../../models/MuteRole'

export default class Unmute extends Command {
    public constructor() {
        super('unmute', {
            aliases: ['unmute', 'unsilence', 'unshadowrealm'],
            category: 'Moderation',
            description: {
                    content: 'Unmutes a user',
                    usage: 'unmute [@user] <reason>',
                    examples: ['unmute @user false mute']
            },
            channel: 'guild',
            userPermissions: ['MANAGE_ROLES'],
            clientPermissions: ['MANAGE_ROLES'],
            ratelimit: 3,
            args: [
                {
                    id: 'member',
                    type: 'member',
                    prompt: {
                        start: (msg: Message) => `${msg.author}, please select a member to unmute`,
                        retry: (msg: Message) => `${msg.author}, please select a valid member to unmute`,
                        cancel: () => 'The command has now been cancelled.'
                    }
                },
                {
                    id: 'reason',
                    type: 'string',
                    match: 'rest'
                }
            ]
        })
    }

    public async exec(message: Message, {member, reason}: {member: GuildMemberResolvable, reason: string}): Promise<Message> {
        const userResolved: GuildMember = message.mentions.members.first() || message.guild.members.resolve(member)

        const muteRoleID: RoleResolvable = await this.client.db.getRepository(MuteRole).find()
            .then(mr => { return mr.find(m => m.guild === message.guild.id)})
            .then(m => {return m.role})
            .catch(() => void 0)

        if (userResolved.roles.highest.position < message.guild.me.roles.highest.position) {
            if (userResolved.roles.cache.get(muteRoleID.toString())) {
                userResolved.roles.remove(muteRoleID)
                return message.util!.send(`${userResolved.user.tag} has been unmuted.`)
            }
        }

        return message.util!.send('Unable to unmute member.')
    
    }
}