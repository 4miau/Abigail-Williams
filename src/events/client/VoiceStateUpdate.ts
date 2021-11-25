import { Listener } from 'discord-akairo'
import { VoiceState } from 'discord.js'

export default class VoiceStateUpdate extends Listener {
    public constructor() {
        super('voicestateupdate', {
            emitter: 'client',
            event: 'voiceStateUpdate',
            category: 'client'
        })
    }

    public async exec(oldState: VoiceState, newState: VoiceState): Promise<void> {
        this.client.music.player._voiceUpdate(oldState, newState)
    }
}

/*
        if (oldState.channelId !== oldState.guild.me.voice.channelId || newState.channelId) return
        
        if (!(oldState.channel.members.size - 1)) setTimeout(() => { if (!(oldState.channel.members.size - 1)) oldState.guild.me.voice.disconnect() }, 3e5)
*/