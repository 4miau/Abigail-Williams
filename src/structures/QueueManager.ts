import { AkairoClient as Abby } from 'discord-akairo'

export default class Queue {
    protected _queue: any[]
    protected _running: boolean
    protected client: Abby

    constructor(client: Abby) {
        this._queue = []
        this._running = false
        this.client = client
    }

    get length() { return this._queue.length }

    add(promise: any) {
        this._queue.push(promise)
        if (!this._running) this._run()
    }

    private _run() {
        this._running = true
        const promise: any = this._queue.shift()

        if (!promise) this._running = false
        else {
            promise?.isFunc() ? promise().then(() => this._run()).catch((err: any) => { this.client.logger.log('ERROR', err) }) : void 0
        }
    }
}