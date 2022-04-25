import { Message } from 'discord.js'

import Service from '../../modules/Service'

export default class RemoveRoleMenu extends Service {
    public constructor() {
        super('removerolemenu', {
            category: 'Reaction Role'
        })
    }

    async exec(message: Message, group: RoleGroup, msg: Message) {
        const loading = await message.channel.send('Removing rolemenu instance...')
        group.messages = group.messages.filter(m => m.message !== msg.id)
    
        await msg.reactions.removeAll().catch(void 0)
        msg.author === msg.client.user ? msg.delete() : void 0
        loading.edit('Successfully removed this rolemenu.').catch(void 0)
        setTimeout(() => loading.delete(), 1e4)
        
        return group
    }
}