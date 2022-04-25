import Service from '../../modules/Service'

export default class FetchMessageReacts extends Service {
    public constructor() {
        super('fetchmessagereacts', {
            category: 'GuildAsync'
        })
    }

    async exec(): Promise<void> {
        const getGuildMsg = this.handler.modules.get('getguildmessage')

        for (const guild of this.client.guilds.cache.values()) {
            const roleGroups: RoleGroup[] = this.client.settings.get(guild, 'role-groups', [])
            if (roleGroups.arrayEmpty()) continue
            for (const group of roleGroups.values()) {
                if (group.messages.arrayEmpty()) continue
                for (const roleMessage of group.messages.values()) {
                    try {
                        await getGuildMsg.exec(guild, roleMessage.message)
                    } catch (err) {
                        this.client.logger.log('ERROR', err)
                        continue
                    }
                }
            }
        }
    }
}