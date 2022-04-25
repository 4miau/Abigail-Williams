import { Guild, Message } from 'discord.js'

import Service from '../../modules/Service'

export default class ResetRoleMenu extends Service {
    public constructor() {
        super('resetrolemenu', {
            category: 'Reaction Role'
        })
    }

    async exec(message: Message, messageGroup: RoleMessage, msg: Message) {
        const getEmoteService = this.client.serviceHandler.modules.get('getreactemote')

        const resetMessage = await message.channel.send('Resetting the reacts for the provided message.')
        await msg.reactions.removeAll()

        try {
            for (const [i, r] of messageGroup.reacts.entries()) {
                const role = message.guild.roles.resolve(r.role)

                try {
                    const emote = this.parseEmojiString(r.emoji, message.guild)
                    await msg.react(emote)
                } catch {
                    await resetMessage.edit(`Please provide a new react for the role \`${role.name}\` (react to this message)`)

                    const oldEmote = messageGroup.reacts[i].emoji
                    const newEmote = await getEmoteService.exec(message, resetMessage)

                    await msg.react(newEmote)
                    messageGroup.reacts[i].emoji = newEmote.identifier

                    if (msg.author.id === this.client.user.id) {
                        const messageContent = msg.content
                        await msg.edit(messageContent.replace(oldEmote, newEmote))
                    }
                }
            }

            await resetMessage.edit('Successfully reset the reactions for the rolemenu instance.')
            setTimeout(() => resetMessage.delete().catch(void 0), 5000)
            return messageGroup
        } catch {
            message.channel.send('Unable to re-add the reactions.\nThis is possibly because some emotes are no longer available.')
            return null
        }
    }

    parseEmojiString(emoji: string, guild: Guild) {
        if (emoji.includes('%')) return emoji
        else return this.client.emojis.resolve(emoji.substring(emoji.lastIndexOf(':') + 1, emoji.lastIndexOf('>'))) //ID
    }
}