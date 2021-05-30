import BotClient from "../client/BotClient"

export default class Queue {
    protected _queue: any[]
    protected _running: boolean
    protected client: BotClient

    constructor(client: BotClient) {
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
            typeof promise === 'function' ? promise().then(() => this._run()).catch((err: any) => { this.client.logger.log('ERROR', err) }) : void 0
        }
    }
}