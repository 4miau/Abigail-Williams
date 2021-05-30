import { Argument, Command } from 'discord-akairo'
import { Message, MessageEmbed, TextChannel } from 'discord.js'
import moment from 'moment'

import { Giveaways } from '../../models/Giveaways'
import { Colours } from '../../util/Colours'
import ms from 'ms'

export default class EditGiveaway extends Command {
    public constructor() {
        super('editgiveaway', {
            aliases: ['editgiveaway'],
            category: 'General',
            description: {
                content: 'Manage an existing giveaway.',
                usage: 'editgiveaway [messageID] [prize/time/winners] [value]',
                examples: ['editgiveaway 1234567890 prize Nitro!', 'editgiveaway 1234567890 time 3d', 'editgiveaway 1234567890 winners 3'],
                flags: ['prize', 'time', 'winners']
            },
            channel: 'guild',
            ratelimit: 3,
            args: [
                {
                    id: 'msgID',
                    type: 'message'
                },
                {
                    id: 'type',
                    type: (_: Message, str: string) => {
                        if (!str) return null
                        if (str === 'prize' || str === 'time' || str === 'winners') return str
                    },
                    match: 'phrase'
                },
                {
                    id: 'newValue',
                    type: Argument.union('number', 'string', 'time'),
                    match: 'rest'
                }
            ]
        })
    }

    //@ts-ignore
    userPermissions(message: Message) {
        const modRole: string = this.client.settings.get(message.guild, 'modRole', '')
        const hasStaffRole = message.member.hasPermission('MANAGE_GUILD', { checkAdmin: true, checkOwner: true}) || message.member.roles.cache.has(modRole)

        if (!hasStaffRole) return 'Moderator'
        return null
    }

    public async exec(message: Message, {msgID, type, newValue}: {msgID: Message, type: string, newValue: any}): Promise<Message> {
        if (!msgID) return message.util!.send('Provide a message with a giveaway so I can edit it...')
        if (!type) return message.util!.send('Well uh, how will I know what to change about the giveaway, huh?')
        if (!newValue) return message.util!.send('Uhm, no new value for the type? That\'s unhelpful.')

        const giveawayRepo = this.client.db.getRepository(Giveaways)
        const currGiveaway = await giveawayRepo.findOne({ message: msgID.id })

        if (!currGiveaway) return message.util!.send('This message does not have a giveaway attached to it...')

        const channel = message.guild.channels.resolve(currGiveaway.channel) as TextChannel

        const editGiveaway = {
            'prize' : async () => {
                if (typeof newValue !== 'string' || newValue.length < 4) {
                    message.channel!.send('The new value to replace the message needs to be a string (greater than 4 characters).')
                    return;
                }

                await channel.messages.fetch({ limit: 100 })
                    .then(msgCol => msgCol.find(msg => msg.id === currGiveaway.message))
                    .then(async msg => {
                        const e = new MessageEmbed()
                            .setAuthor(`Giveaway | ${newValue}`)
                            .setColor(Colours.Spring)
                            .setDescription(`React with 🎉 to enter!
                                Giveaway is hosted by ${message.author}!
                            `)
                            .setFooter(`Ends at • ${moment(currGiveaway.end).utcOffset(1).format('YYYY/M/DD HH:mm:ss')} ${currGiveaway.winners > 1 ? ' | ' + currGiveaway.winners + ' winners' : ''}`)

                            await msg.edit(e)
                            await message.channel!.send('Updated the prize of the provided giveaway!')

                            await giveawayRepo.save(currGiveaway)
                    })
                    .catch(() => message.util!.send('Failed to update the prize, please try again.'))
                
            },
            'time' : async () => { 
                if (!Number(ms(newValue))) {
                    message.channel!.send('The new value to add on to the time needs to be a number (e.g. 3d, 30s)')
                    return;
                }

                currGiveaway.end = Date.now() + (Number(ms(newValue)))

                await channel.messages.fetch({ limit: 100 })
                    .then(msgCol => msgCol.find(msg => msg.id === currGiveaway.message))
                    .then(async msg => {
                        const e = new MessageEmbed()
                            .setAuthor(`Giveaway | ${currGiveaway.reward}`)
                            .setColor(Colours.Spring)
                            .setDescription(`React with 🎉 to enter!
                                Giveaway is hosted by ${message.author}!
                            `)
                            .setFooter(`Ends at • ${moment(currGiveaway.end).utcOffset(1).format('YYYY/M/DD HH:mm:ss')} ${currGiveaway.winners > 1 ? ' | ' + currGiveaway.winners + ' winners' : ''}`)

                        await msg.edit(e)
                        await message.channel!.send('Updated the end time of the provided giveaway!')

                        await giveawayRepo.save(currGiveaway)
                    })
                    .catch(() => message.util!.send('Failed to update the prize, please try again.'))
            },
            'winners' : async () => { 
                if (typeof newValue !== 'number') {
                    message.channel!.send('The new value to replace the number of winners needs to be a number.')
                    return;
                }

                currGiveaway.winners = (newValue as number)

                await channel.messages.fetch({ limit: 100 })
                    .then(msgCol => msgCol.find(msg => msg.id === currGiveaway.message))
                    .then(async msg => {
                        const e = new MessageEmbed()
                            .setAuthor(`Giveaway | ${currGiveaway.reward}`)
                            .setColor(Colours.Spring)
                            .setDescription(`React with 🎉 to enter!
                                Giveaway is hosted by ${message.author}!
                            `)
                            .setFooter(`Ends at • ${moment(currGiveaway.end).utcOffset(1).format('YYYY/M/DD HH:mm:ss')} ${currGiveaway.winners > 1 ? ' | ' + currGiveaway.winners + ' winners' : ''}`)

                        await msg.edit(e)
                        await message.channel!.send('Updated the number of winners for the provided giveaway!')

                        await giveawayRepo.save(currGiveaway)
                    })
                    .catch(() => message.util!.send('Failed to update the prize, please try again.'))
            }
        }

        this.client.queue.add(editGiveaway[type].call())
    }
}