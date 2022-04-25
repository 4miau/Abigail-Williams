import { AkairoClient, AkairoHandler, AkairoHandlerOptions, Category } from 'discord-akairo'
import Service from '../modules/Service'
import { Heap } from '../util/structures/Heap'

export default class ServiceHandler extends AkairoHandler {
    client: AkairoClient
    options: AkairoHandlerOptions
    
    modules: Heap<string, Service>
    categories: Heap<string, Category<string, Service>>

    public constructor(client: AkairoClient, options: AkairoHandlerOptions = {}) {
        super(client, {
            directory: options.directory,
            classToHandle: Service,
        })

        const modules = this.modules
        const categories = this.categories

        this.modules = new Heap<string, Service>(modules)
        this.categories = new Heap<string, Category<string, Service>>(categories)
    }
}