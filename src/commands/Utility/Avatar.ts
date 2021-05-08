import { Command } from 'discord-akairo'
import { Message, MessageEmbed, User, ImageSize } from 'discord.js'

export default class Avatar extends Command {
    public constructor() {
        super('avatar', {
            aliases: ['avatar', 'pfp', 'icon', 'ava'],
            category: 'Utility',
            description: {
                    content: 'Gets the avatar of a member',
                    usage: 'avatar [@user]',
                    examples: ['avatar @user', 'avatar 1337']
            },
            clientPermissions: ['EMBED_LINKS'],
            ratelimit: 3,
            args: [
                {
                    id: 'member',
                    type: 'string',
                    match: 'rest',
                    default: (msg: Message) => msg.member.id
                },
                {
                    id: 'size',
                    type: (_: Message, str: string): null | Number => {
                        if (str && !isNaN(Number(str)) && [16, 32, 64, 128, 256, 512, 1024, 2048].includes(Number(str))) return Number(str)
                        return null
                    },
                    match: 'option',
                    flag: ['-size='],
                    default: 2048
                }
            ]
        })
    }

    public exec(message: Message, {member, size}: {member: string, size: number}): Promise<Message> {
        try {
            const userResolved: User = this.client.util!.resolveUser(member, this.client.users.cache, false)
    
            return message.util!.send(new MessageEmbed()
                .setTitle(`Avatar | ${userResolved.tag}`)
                .setColor('RANDOM')
                .setDescription(`${userResolved.tag}'s avatar`)
                .setImage(userResolved.displayAvatarURL({ format: 'png', size: size as ImageSize, dynamic: true }))
                .setFooter(`${userResolved.tag}`)
            )
        } catch (err) {
            return message.util!.reply('There was an error retrieving this user, please try again!')
        }

    }
}