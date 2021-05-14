import { ConnectionManager } from 'typeorm'
import { dbName } from '../Config'

import { Warns } from '../models/Warns'
import { Bans } from '../models/Bans'
import { MuteRole } from '../models/MuteRole'
import { BotStatus } from '../models/BotStatus'
import { Giveaways } from '../models/Giveaways'
import { Settings } from '../models/Settings'

const connectionManager: ConnectionManager = new ConnectionManager()
connectionManager.create({
    name: dbName,
    type: 'sqlite',
    database: './db.sqlite',
    entities: [
        Warns,
        Bans,
        MuteRole,
        BotStatus,
        Giveaways,
        Settings
    ]
})

export default connectionManager