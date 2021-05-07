import { ConnectionManager } from 'typeorm'
import { dbName } from '../Config'

import { Warns } from '../models/Warns'
import { Bans } from '../models/Bans'
import { MuteRole } from '../models/MuteRole'
import { Settings } from '../models/Settings'
import { BotStatus } from '../models/BotStatus'

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
        Settings
    ]
})

export default connectionManager