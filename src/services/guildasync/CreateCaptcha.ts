import Captcha from '@haileybot/captcha-generator'
import fs from 'fs'
import Jimp from 'jimp/*'
import { join } from 'path'

import Service from '../../modules/Service'
import { captchasDir } from '../file/FileConstants'

export default class CreateCaptcha extends Service {
    public constructor() {
        super('createcaptcha', {
            category: 'GuildAsync'
        })
    }

    async exec(): Promise<Captcha> {
        const captcha = new Captcha()
        captcha.PNGStream.pipe(fs.createWriteStream(join(captchasDir, `${captcha.value}.png`)))
        return captcha
    }
}