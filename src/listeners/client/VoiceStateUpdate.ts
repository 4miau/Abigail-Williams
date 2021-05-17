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
        if (oldState.channelID !== oldState.guild.me.voice.channelID || newState.channelID) return

        if (!(oldState.channel.members.size - 1)) //-1 because of the bot itself
            setTimeout(() => { if (!(oldState.channel.members.size - 1)) oldState.channel.leave() }, 3e5)
    }
}