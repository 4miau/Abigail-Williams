import { Listener } from 'discord-akairo'

export default class Ready extends Listener {
    public constructor() {
        super('ready', {
            emitter: 'client',
            event: 'ready',
            category: 'client'
        })
    }

    public async exec(): Promise<void> {
        this.client.logger.log('INFO', `${this.client.user.tag} has successfully connected.\nShard Count: ${this.client.ws.shards.size}`)
        this.client.users.resolve(this.client.ownerID as string).createDM().then(async dm => {
            const online = await dm.send('I am now online, master.')
            setTimeout(() => online.delete(), 10000)
        })

        const setupServices = this.client.serviceHandler.modules.getArr(
            'setabbypaths', 'setbotstatus', 'fetchmessagereacts',
            'setupstarboard', 'setpremiumguilds', 'setgiveaways',
            'twitchnotifications'
        )

        setupServices[0].exec()
        setupServices[1].exec()
        this.client.queue.add(setupServices[2].exec())
        this.client.queue.add(setupServices[3].exec())
        this.client.queue.add(this.client.threadManager._init())

        /* [Interval Subfunctions (async)] */
        setInterval(async () => { this.client.queue.add(setupServices[4].exec()) }, 6e4)
        setInterval(async () => { this.client.queue.add(setupServices[5].exec()) }, 3e5)
        setInterval(async () => { this.client.queue.add(setupServices[6].exec()) }, 3e5)
    }
}