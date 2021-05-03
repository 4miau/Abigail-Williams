import { ConnectionManager } from 'typeorm'
import { dbName } from '../Config'

import { Warns } from '../models/Warns'
import { Bans } from '../models/Bans'
import { MuteRole } from '../models/MuteRole'
import { ModmailSetup } from '../models/ModmailSetup'
import { ChannelBlacklists } from '../models/ChannelBlacklists'

const connectionManager: ConnectionManager = new ConnectionManager()
connectionManager.create({
    name: dbName,
    type: 'sqlite',
    database: './db.sqlite',
    entities: [
        Warns,
        Bans,
        MuteRole,
        ModmailSetup,
        ChannelBlacklists
    ]
})

export default connectionManager