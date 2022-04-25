import { AkairoModuleOptions } from 'discord-akairo'
import { AkairoModule } from 'discord-akairo'
import ServiceHandler from '../handlers/ServiceHandler'

export default class Service extends AkairoModule {
    handler: ServiceHandler

    public constructor(id: string, options: AkairoModuleOptions = {}) {
        super(id, options)
    }

    exec(..._: any): any {
        throw new Error('Not implemented!')
    }
}