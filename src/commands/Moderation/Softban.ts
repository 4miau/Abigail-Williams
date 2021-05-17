import { Command } from 'discord-akairo'
import { GuildMember, Message } from 'discord.js'

export default class Softban extends Command {
    public constructor() {
        super('softban', {
            aliases: ['softban'],
            category: 'Moderation',
            description: {
                content: 'Bans a user and immediately unbans them to clear message history.',
                usage: 'softban [@user] [reason]',
                examples: ['softban user being toxic'],
            },
            userPermissions: ['BAN_MEMBERS'],
            ratelimit: 3,
            args: [
                {
                    id: 'member',
                    type: 'member'
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
        if (!member) return message.util!.send('Yo must provide a member.')

        try {
            await member.ban({ 'reason': reason ? reason : 'No reason specified'})
                .then(bu => message.guild.members.unban(bu))
            return message.util!.send(`${member.user.tag} has been softbanned.`)
        } catch (err) {  return message.util!.send('I do not have permissions to softban this user.') }
    }
}