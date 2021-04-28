import { ConnectionManager } from 'typeorm'
import { dbName } from '../Config'

import { Warns } from '../models/Warns'
import { Bans } from '../models/Bans'
import { MuteRole } from '../models/MuteRole'

const connectionManager: ConnectionManager = new ConnectionManager()
connectionManager.create({
    name: dbName,
    type: 'sqlite',
    database: './db.sqlite',
    entities: [
        Warns,
        Bans,
        MuteRole
    ]
})

export default connectionManager