import { TextChannel, GuildMember, Message, MessageCollector, DMChannel, MessageAttachment } from 'discord.js'
import Captcha from '@haileybot/captcha-generator'
import fs from 'fs'
import ms from 'ms'
import { join } from 'path'

import Service from '../../modules/Service'
import { captchasDir } from '../file/FileConstants'

export default class ManageCaptcha extends Service {
    captchaCreate: Service
    fileCount: Service

    public constructor() {
        super('managecaptcha', {
            category: 'GuildAsync'
        })
    }

    async exec(chnl: TextChannel, member: GuildMember): Promise<void> {
        this.captchaCreate = this.client.serviceHandler.modules.get('createcaptcha')
        this.fileCount = this.client.serviceHandler.modules.get('filecount')
        
        const captcha: Captcha = await this.captchaCreate.exec()
        const name = `captcha-${this.fileCount.exec(captchasDir)}.png`

        try {
            const dmChannel = await member.createDM()
                .then(async channel => {
                    await channel.send({ files: [new MessageAttachment(captcha.PNGStream, name)] })
                    return channel
                })
                .catch((_) => {
                    this.client.logger.log('ERROR', _)
                    throw new Error('DMs') 
                })
            
            const filter = (m: Message) => { return m.author.id === member.user.id }
            const collector = dmChannel.createMessageCollector({ filter: filter, time: ms('5m') })

            await this.collectorHandler(collector, member, dmChannel, captcha.value)
            fs.unlinkSync(join(captchasDir, `${captcha.value}.png`))
        } catch (err) {
            console.log(err)
            if (err.message.caseCompare('DMs')) chnl.send(`You need to enable DMs from this server to be able to receive a captcha ${member}`)
            else chnl.send(`An error occurred trying to add/remove your roles ${member}, wait for this to be solved.`)
        }
    }

    private async collectorHandler(collector: MessageCollector, member: GuildMember, dmChannel: DMChannel, captcha: string) {
        return new Promise(() => {
            collector.on('collect', async (m: Message) => {
                if (m.content === captcha) {
                        collector.stop('Successfully solved captcha.')

                    const roles: string[] = this.client.settings.getArr(member.guild, [
                        { key: 'verified-role', defaultValue: '' },
                        { key: 'unverified-role', defaultValue: '' }
                    ])

                    roles[0] ? await member.roles.add(roles[0]) : void 0
                    roles[1] ? await member.roles.remove(roles[1]) : void 0

                    await m.channel.send(`You have successfully verified.\nGuild: ${member.guild.name}`)
                }
            })
            collector.on('end', async (_, reason) => {
                if (!reason || reason !== 'Successfully solved captcha.') await dmChannel.send('Captcha has timed out.')
            })
        })
    }
}