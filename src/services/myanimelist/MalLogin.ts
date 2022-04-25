import { Mal } from 'node-myanimelist'

import { envs } from '../../client/Components'
import Service from '../../modules/Service'

export default class _MalLogin extends Service {
    public constructor() {
        super('mallogin', {
            category: 'MAL'
        })
    }

    async exec(): Promise<Mal.MalAcount> { return Mal.auth(envs.MALClientID).Unstable.login(envs.MALUser, envs.MALPass) || null }
}
