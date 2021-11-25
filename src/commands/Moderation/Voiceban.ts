import { Command } from 'discord-akairo'
import { GuildMember, Message, Permissions } from 'discord.js'

export default class Voicekick extends Command {
    public constructor() {
        super('voiceban', {
            aliases: ['voiceban'],
            category: 'Moderation',
            description: {
                content: 'Bans a user from joining the current voice channel you are in.',
                usage: 'voiceban [member]',
                examples: ['voiceban miau'],
            },
            channel: 'guild',
            ratelimit: 3,
            args: [
                {
                    id: 'member',
                    type: 'member'
                }
            ]
        })
    }

    //@ts-ignore
    userPermissions(message: Message) {
        const modRole: string = this.client.settings.get(message.guild, 'modRole', '')
        const hasStaffRole = message.member.permissions.has(['KICK_MEMBERS', 'MOVE_MEMBERS'], true) || message.member.roles.cache.has(modRole)

        if (!hasStaffRole) return 'Moderator'
        return null
    }

    public async exec(message: Message, {member}: {member: GuildMember}): Promise<Message> {
        if (!member) return message.channel.send('You need to provide a member to voiceban.')
        if (!member.manageable) return message.channel.send('I do not have permission to voiceban this user.')

        if (member.voice && member.voice.channel.manageable) {
            member.voice.channel.permissionsFor(member).remove('CONNECT')
            await member.voice.disconnect('Voicebanned from Voice Channel.')
            return message.channel.send(`User has been voicebanned from \`${member.voice.channel.name}\``)
        }
        else return message.channel.send('Unable to ban user from voice channel, please provide me permissions to edit the channel.')
    }
}