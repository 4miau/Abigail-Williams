import Service from '../../modules/Service'

export default class YesOrNo extends Service {
    public constructor() {
        super('yesorno', {
            category: 'General'
        })
    }

    exec(content: string): boolean {
        if (content && (/^y(?:e(?:a|s)?)?$/i).test(content)) return true
        else return false
    }
}