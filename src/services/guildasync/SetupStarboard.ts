import Service from '../../modules/Service'
import Starboard from '../../structures/StarboardManager'

export default class SetupStarboard extends Service {
    public constructor() {
        super('setupstarboard', {
            category: 'category'
        })
    }

    async exec(): Promise<void> {
        for (const guild of this.client.guilds.cache.map(g => g)) {
            if (!this.client.starboards.has(guild.id)) {
                const starboard = new Starboard(this.client, guild)
                this.client.starboards.set(guild.id, starboard)
            }
        }
    }
}