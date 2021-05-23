import { ConnectionManager } from 'typeorm'
import { dbName } from '../Config'

import { BotStatus } from '../models/BotStatus'
import { Giveaways } from '../models/Giveaways'
import { Settings } from '../models/Settings'
import { Case } from '../models/Case'
import { MemberData } from '../models/MemberData'

const connectionManager: ConnectionManager = new ConnectionManager()
connectionManager.create({
    name: dbName,
    type: 'sqlite',
    database: './db.sqlite',
    entities: [
        Case,
        BotStatus,
        Giveaways,
        MemberData,
        Settings
    ]
})

export default connectionManager