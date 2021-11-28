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
    }
}