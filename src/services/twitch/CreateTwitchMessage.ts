import Service from '../../modules/Service'

export default class CreateTwitchMessage extends Service {
    public constructor() {
        super('createtwitchmessage', {
            category: 'Twitch'
        })
    }

    async exec(streamer: string, message: string): Promise<string> {
        const getStreamer = this.handler.modules.get('getuserbyname')
        const stream = await getStreamer.exec(streamer)
        
        return message
            .replaceAll('{title}', `${stream.title}`)
            .replaceAll('{name}', `${stream.display_name}`)
            .replaceAll('{game}', `${stream.game_name}`)
            .replaceAll('{link}', `https://twitch.tv/${stream.broadcaster_login}`)
    }
}