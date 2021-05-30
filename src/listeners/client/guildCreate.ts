import { Listener } from 'discord-akairo'
import { Guild } from 'discord.js'

import BotClient from '../../client/BotClient';
import Starboard from '../../structures/StarboardManager';

export default class GuildCreate extends Listener {
    public constructor() {
        super('guildcreate', {
            emitter: 'client',
            event: 'guildCreate',
            category: 'client'
        })
    }

    public exec(guild: Guild) {
        this.client.starboards.set(guild.id, new Starboard(this.client as BotClient, guild));
    }
}