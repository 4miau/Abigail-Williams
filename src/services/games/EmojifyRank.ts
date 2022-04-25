import Service from '../../modules/Service'

export default class EmojifyRank extends Service {
    public constructor() {
        super('emojifyrank', {
            category: 'Games'
        })
    }

    exec(rank: string): string {
        if (rank.includes('Bronze')) return '<:1Bronze:842770590993350687>'
        else if (rank.includes('Silver')) return '<:2Silver:842770591614631966>'
        else if (rank.includes('Gold')) return '<:3Gold:842770591798394900>'
        else if (rank.includes('Platinum')) return '<:4Platinum:842770592424001586>'
        else if (rank.includes('Diamond')) return '<:5Diamond:842770592411025448>'
        else if (rank.includes('Master')) return '<:6Master:842770593027850260>'
        else if (rank.includes('Apex Predator')) return '<:7ApexPredator:842770592553238548>'
        else return null
    }
}