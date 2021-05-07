import { Command } from 'discord-akairo'
import { GuildMember, Message } from 'discord.js'
import { Repository } from 'typeorm'

import { Warns } from '../../models/Warns'

export default class Warn extends Command {
    public constructor() {
        super('warn', {
            aliases: ['warn'],
            category: 'Moderation',
            description: [
                {
                    content: 'Warns a user',
                    usage: 'warn [@user] <reason>',
                    examples: ['warn @user spamming']
                }
            ],
            channel: 'guild',
            userPermissions: ['VIEW_AUDIT_LOG'],
            clientPermissions: ['VIEW_AUDIT_LOG'],
            ratelimit: 3,
            args: [
                {
                    id: 'member',
                    type: 'member',
                    prompt: {
                        start: (msg: Message) => `${msg.author}, please provide a member to warn...`,
                        retry: (msg: Message) => `${msg.author}, please provide a valid member to warn...`,
                        cancel: () => 'This command has now been cancelled.'
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

    public async exec(message: Message, {member, reason}: {member: GuildMember, reason: string}): Promise<Message> {
        const warnRepo: Repository<Warns> = this.client.db.getRepository(Warns)

        if (member.roles.highest.position >= message.member.roles.highest.position || message.author.id === message.guild.ownerID)
            return message.util.reply('This person has higher or equal roles to you, I can not warn this user!')

        await (warnRepo.insert({
            guild: message.guild.id,
            user: member.id,
            moderator: message.author.id,
            reason: reason
        }))

        return message.util.send(`${member.user.tag} has been warned by ${message.author.tag} for \*${reason}\*`)
    }
}