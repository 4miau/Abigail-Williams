import { Listener } from 'discord-akairo'

export default class UnhandledRejection extends Listener {
    public constructor() {
        super('unhandledrejection', {
            emitter: 'process',
            event: 'unhandledRejection',
            category: 'process'
        })
    }

    public exec(err: Error) {
        this.client.logger.log('ERROR', `Unhandled Rejection. ${err.stack}`)
        process.exit(1)
    }
}