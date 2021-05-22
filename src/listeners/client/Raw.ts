import { Listener } from "discord-akairo";
import { VoicePacket } from "erela.js";

export default class Raw extends Listener {
    public constructor() {
        super('raw', {
            emitter: 'client',
            type: 'client',
            event: 'raw',      
        })
    }

    public async exec(): Promise<void> {
        this.client.on('raw', (d: VoicePacket) => this.client.manager.updateVoiceState(d))
    }
}