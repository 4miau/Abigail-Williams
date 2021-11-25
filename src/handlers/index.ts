import { Message } from 'discord.js'

import type Abby from '../client/Abby'

export const unitTesting = false

export const messageHandler = (message: Message) => {
    message.channel.send('hello')
    message.channel.send('<3')
}

/*
    const c = message.client as Abby
    if (c.isOwner(message.author)) return message.channel.send('<3')
*/