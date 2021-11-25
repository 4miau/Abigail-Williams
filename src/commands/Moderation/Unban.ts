import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

import Case from '../../models/Case'
import ModUtil from '../../util/structures/ModUtil'

export default class Unban extends Command {
    public constructor() {
        super('unban', {
            aliases: ['unban', 'unbean'],
            category: 'Moderation',
            description: {
                    content: 'Unbans a currently banned user.',
                    usage: 'unban [userID] <reason>',
                    examples: ['unban 1337 was a mistake']
            },
            channel: 'guild',
            userPermissions: ['BAN_MEMBERS'],
            clientPermissions: ['SEND_MESSAGES', 'BAN_MEMBERS'],
            ratelimit: 3,
            args: [
                {
                    id: 'user',
                    type: (_: Message, str: string) => { return str.toLowerCase() || null },
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

    //@ts-ignore
    userPermissions(message: Message) {
        const modRole = this.client.settings.get(message.guild, 'modRole', '')
        const hasStaffRole = message.member.permissions.has('BAN_MEMBERS', true) || message.member.roles.cache.has(modRole)

        if (!hasStaffRole) return 'Moderator'
        return null
    }

    public async exec(message: Message, {user, reason}: {user: string, reason: string}): Promise<Message> {
        if (!user) return message.channel.send('Okay, so who am I meant to unban then? Provide a user please.')

        const totalCases: number = this.client.settings.get(message.guild, 'totalCases', 0) + 1
        const bannedUser = await message.guild.bans.fetch()
            .then(bans => bans.find(u => 
                u.user.id === user || u.user.username.toLowerCase() === user || u.user.username.toLowerCase().includes(user) || u.user.tag.toLowerCase() === user)?.user
            )
            .catch(void 0)

        if (!bannedUser) return message.channel.send('User could not be found on the server banlist, please try again.')

        try {
            await message.guild.members.unban(bannedUser, reason)
            this.client.settings.set(message.guild, 'totalCases', totalCases)
            const loading = await message.channel.send('Unbanning user...')

            await new Case({
                id: await Case.countDocuments() + 1,
                guildID: message.guild.id,
                messageID: message.id,
                caseID: totalCases,

                action: ModUtil.CONSTANTS.ACTIONS.UNBAN,
                reason: reason,

                targetID: bannedUser.id,
                targetTag: bannedUser.tag,
                modID: message.author.id,
                modTag: message.author.tag
            }).save()

            loading.delete()
            message.channel.send('User has been unbanned from the server successfully.')
        } catch (err) {
            message.channel.send('Unable to unban user, please try again and report this.')   
        }    
    }
}