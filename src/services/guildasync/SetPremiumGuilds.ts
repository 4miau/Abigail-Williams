import Service from '../../modules/Service'

export default class SetPremiumGuilds extends Service {
    public constructor() {
        super('setpremiumguilds', {
            category: 'GuildAsync'
        })
    }

    async exec(): Promise<void> {
        const premiumUsers: string[] = this.client.settings.get('global', 'premium-users', [])
        if (!premiumUsers) return
        
        this.client.guilds.cache.forEach(async g => {
            if (g.members.cache.some(m => premiumUsers.includes(m.user.id))) this.client.settings.set(g, 'has-premium', true)
            else this.client.settings.set(g, 'has-premium', false)
        })
    }
}