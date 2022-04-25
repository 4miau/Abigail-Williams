import { GuildEmoji, Message, ReactionEmoji } from 'discord.js'
import Service from '../../modules/Service'

export default class CreateRoleMenu extends Service {
    public constructor() {
        super('createrolemenu', {
            category: 'Reaction Role'
        })
    }

    async exec(message: Message, group: RoleGroup, msg: Message = null): Promise<RoleGroup> {
        const getEmote = this.handler.modules.get('getreactemote')
        const reactData: RoleMessageReacts[] = []

        msg = !msg ? await message.channel.send('Role Menu\nSetting up...') : msg
        const reactMsg = await message.channel.send(`Rolemenu setup: [0/${group.roles.length}]`)
        let lastContent = ''

        for (let [i, r] of group.roles.entries()) {
            const role = message.guild.roles.resolve(r)

            if (role) {
                reactMsg.edit(this.reactMessageBuilder(1, [i + 1, group.roles.length, role.name]))

                const emote: GuildEmoji | ReactionEmoji = await getEmote.exec(message, reactMsg, msg)
                if (!emote) return
                reactData.push({ emoji: emote.identifier, role: r })

                if (i === 0 && (msg.author.id === this.client.user.id))  {
                    msg.edit(`**Role Menu: ${group.groupName}**\n\n${emote}:\`${role.name}\``).then(m => lastContent = m.content)
                }
                else if (msg.author.id === this.client.user.id) {
                    msg.edit(`${lastContent}\n${emote}:\`${role.name}\``)
                } 
            }
        }

        reactMsg.edit(this.reactMessageBuilder(2, [group.groupName, msg.id]))
        
        group.messages.push({ message: msg.id, channel: msg.channel.id, nodm: false, rr: true, reacts: reactData })
        return group
    }

    reactMessageBuilder(num: number, data?: any[]): string {
        switch(num) {
            case 1: {
                return (
                    `Rolemenu setup: [${data[0]}/${data[1]}]\n` +
                    `React with the emoji for the role command: \`${data[2]}\`\n` +
                    'Note: The bot must be in the server the emoji is from, else it will fail.\n\n' +
                    'Throughout the setup, the message will be updated.'
                )
            }
            case 2: {
                return (
                    'Setup complete! You can delete all the messages now (except for the menu itself)\n\n' +
                    'Flags:\n' +
                    `\`-nodm: false\` toggle with \`rolemenu update -nodm ${data[1]}\`: disables dm messages.\n` +
                    `\`-rr: true\` toggle with \`rolemenu update -rr ${data[1]}\`: removing reactions removes the role.`
                )
            }
            default: { return null }
        }
    }
    //! Strange method although the data being passed in is known
}