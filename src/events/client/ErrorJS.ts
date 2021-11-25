import { Listener } from 'discord-akairo'

export default class ErrorJS extends Listener {
    public constructor() {
        super('errorjs', {
            emitter: 'client',
            event: 'error',
            category: 'client'
        })
    }

    public exec(err: Error) {
        this.client.logger.log('ERROR', `The client came across an error.\nError Message:\n${err.message}`)
    }
}