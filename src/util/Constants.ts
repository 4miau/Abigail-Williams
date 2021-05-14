/*
    FUN
*/

//8ball

export const eightBallReplies: string[] = [
    'Yes', 'No', 'Maybe', 'Probably', 'Probably not', 'It is certain, yes', 'I can tell you certainly, no', 'Without a doubt, yes', 'Definitely', 'Definitely not',
    'Ask again later', 'Try again later', 'It is likely', 'It is unlikely', 'Fortunately, yes', 'Unfortunately, no', 'I have decided it is so', 'I have decided it is not',
    'Without a doubt', 'I am uncertain', 'I can not be sure about that', 'If charlie says so, yes'
]

//rr

export const bulletsMin: number = 1
export const bulletsMax: number = 5
export const bulletsTotal: number = 6

export const emojiList: string[] = [
    ':grinning:', ':grimacing:', ':joy:', ':smiley:', ':smile:', ':wink:', ':fearful:', ':persevere:', ':confounded:', ':tired_face:', ':triumph:', ':flushed:',
    ':neutral_face:', ':expressionless:', ':mask:', ':sob:', ':sleepy:'
]

export const deadList: string[] = [
    'I guess you didn\'t have any luck today.',
    'sometimes it is just one of those days.',
    'and you are dead!',
    'rest in peace, my friend.',
    'guns are very dangerous!',
    'that\'s a lot of blood...',
    'I think there was some lag there...blame that.',
    'rr seems to be rigged!!!'
]

export const liveList: string[] = [
    'silence fills the air...you get to live another day.',
    'you look pretty smug for almost dying!',
    'you breathe a sigh of relief, realising you get have survived another day',
    'you are one lucky man.',
    'I was kind of expecting a big bang.',
    'of course you survived, you are MLG!'
]

/*
    GENERAL
*/

//Help

export const commandsGithub: string = 'https://github.com/notmiauu/abby-bot#commands'

export const pages: readonly number[] = [1, 2] 

/*
    MODERATION
*/

//Fixname

export const fixnameMax: number = 9999

//Slowmode

export const slowmodeRange: number[] = [0, 5, 10, 15, 30, 60, 120, 300, 600, 900, 1800, 3600, 7200, 21600] //ms -> s
export const secondsConvert: number = 1000

//Ban

export const minBanDays: number = 8.64e7 //1 DAY
export const maxBanDays: number = 2.6e9 //30 DAYS

//Prune

export const msgFlags: string[] = ['-text', '-emojis', '-bots', '-images', '-embeds', '-mentions', '-links', '-invites', '-left']

export enum flags {
    'text' = 1,
    'bots',
    'images',
    'embeds',
    'mentions',
    'links',
    'invites',
    'left',
    'member'
}

/*
    OWNER
*/

//Activity + Status

export const miauTwitch: string = 'https://twitch.tv/notmiauu'

/*
    TWITCH
*/

export const streamDefaultMessage: string = `{streamer} has gone live! {link}`


/*
    MISC
*/

export const ZERO: number = 0
export const ONE: number = 1