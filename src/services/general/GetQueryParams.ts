import Service from '../../modules/Service'

export default class GetQueryParams extends Service {
    public constructor() {
        super('getqueryparams', {
            category: 'General'
        })
    }

    exec(obj: any) {
        return Object.keys(obj)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
            .join('&')
    }
}