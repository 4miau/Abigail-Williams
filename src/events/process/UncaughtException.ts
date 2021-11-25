import { Listener } from 'discord-akairo'

export default class UncaughtException extends Listener {
    public constructor() {
        super('uncaughtexception', {
            emitter: 'process',
            event: 'uncaughtException',
            category: 'process'
        })
    }

    public exec(err: Error) {
        this.client.logger.log('ERROR', `Unhandled Rejection: ${err.stack}`)
        process.exit(1)
    }
}