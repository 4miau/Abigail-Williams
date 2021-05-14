import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

import { _DanbooruQuery } from '../../util/Functions'

export default class Danbooru extends Command {
    public constructor() {
        super('danbooru', {
            aliases: ['danbooru'],
            category: 'Images',
            description: {
                content: 'Get images from danbooru',
                usage: 'danbooru (tag)',
                examples: ['danbooru dog'],
            },
            ratelimit: 3,
            args: [
                {
                    id: 'tag',
                    type: 'string'
                }
            ]
        })
    }

    public async exec(message: Message): Promise<Message> {
        console.log(await _DanbooruQuery('ganyu_(genshin_impact)'))
        return message.util!.send('hi')
    }
}