import { Message } from 'discord.js'

import Abby from '../../client/Abby'
import Service from '../../modules/Service'

export default class ManageReactRole extends Service {
    public constructor() {
        super('managereactrole', {
            category: 'Reaction Role'
        })
    }

    exec(option: ReactOptions, value: string, group: string, msg: Message): string {
        const cli = msg.guild.client as Abby
        const reactionSettings: RoleGroup[] = cli.settings.get(msg.guild, 'role-groups', [])
        const groupIndex = reactionSettings.findIndex(rg => rg.groupName === group)
    
        if (groupIndex === -1) return 'Error: Unable to find this group.'
    
        switch (option) {
            case 'SINGLELOCK': {
                if (!(['true', 'false'].includes(value))) return 'Error: A valid value was not provided.' //TODO: convert to double caseCompare
    
                if (value === 'true') {
                    if (reactionSettings[groupIndex].singleLock === true) return 'Error: Option is already enabled.'
                    else {
                        reactionSettings[groupIndex].singleLock = true
                        cli.settings.set(msg.guild, 'role-groups', reactionSettings)
                        return 'Successfully enabled singlelock for this role group.'
                    }
                } else {
                    if (reactionSettings[groupIndex].singleLock === false) return 'Error: Option is already disabled.'
                    else {
                        reactionSettings[groupIndex].singleLock = false
                        cli.settings.set(msg.guild, 'role-groups', reactionSettings)
                        return 'Successfully disabled singlelock for this role group.'
                    }
                }
            }
            default:
                return 'Error: Invalid option given.'
        }
    }
}