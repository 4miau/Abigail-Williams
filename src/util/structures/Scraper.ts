import { load } from 'cheerio'
import puppeteer, { Browser } from 'puppeteer'

export class Scraper {
    browser: Browser

    async _init() { this.browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'], headless: true }) }

    async _exit() { this.browser.isConnected() ? this.browser.close() : void 0 }

    async search(link: string, element?: string) {
        const page = await this.browser.newPage()
        await page.goto(link).catch(() => console.log('Failed to launch page.'))

        const html = await page.evaluate(() => { return document.documentElement.innerHTML })
        const $ = load(html)

        await this.browser.close()

        if (element) {
            const res = $(`${element}`).first()
            return res.text()
        }
        else {
            return `Successfully scraped \`${page.url()}\``
        }
    }
}